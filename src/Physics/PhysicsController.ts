import { Scene } from "../Scene/Scene";
import * as Three from "three"
import { ColliderBehavior } from "./ColliderBehavior.ts";
import { RigidBodyBehavior } from "./RigidBody";
import { Destroyable, } from "../Core/Lifecycle";
import Rapier from '@dimforge/rapier3d-compat'
import { PhysicsDebugRenderer } from "./Debug";
import { Actor } from "../Scene/Actor";
import { ASSERT } from "../Core/Asserts.ts";
import { isActor } from "../Scene/Component.ts";

export interface PhysicsControllerConstructorArguments
{
	gravity?: Three.Vector3;
	debug?: boolean;
}

const temp = {
	v1: new Three.Vector3(),
	v2: new Three.Vector3(),
	v3: new Three.Vector3(),
	q1: new Three.Quaternion(),
	q2: new Three.Quaternion(),
	q3: new Three.Quaternion(),
}

export class PhysicsController implements Destroyable
{
	world?: Rapier.World;

	readonly gravity: Three.Vector3;

	readonly colliders = new Map<number, { component: ColliderBehavior }>;

	readonly rigidBodies = new Map<number, { component: RigidBodyBehavior }>;

	readonly characterControllers = new Map<string, { instance: Rapier.KinematicCharacterController }>;

	scene?: Scene;

	get debug() { return this.#debugRenderer.enabled; }
	set debug(value: boolean) { this.#debugRenderer.enabled = value; }

	constructor(args: PhysicsControllerConstructorArguments = {})
	{
		this.init = this.init.bind(this);
		this.updatePhysicsWorld = this.updatePhysicsWorld.bind(this);

		this.gravity = args.gravity ?? new Three.Vector3(0, -9.81, 0)

		this.#debugRenderer = new PhysicsDebugRenderer(args.debug);
	}

	async init(scene: Scene)
	{
		await Rapier.init();

		this.world = new Rapier.World(this.gravity);
		this.scene = scene;
	}

	start()
	{
		ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
		ASSERT(this.scene, "PhysicsController has not been initialized with a scene yet.");

		this.#debugRenderer.start(this.scene.object3d, this.world);
	}

	addCollider(collider: ColliderBehavior)
	{
		ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
		ASSERT(collider.parent, "ColliderBehavior has no parent.");
		const parent = findAncestorRigidbody(collider.parent);

		console.log("addCollider",this)

		if(collider.collider)
		{
			this.world.removeCollider(collider.collider, true);
		}

		collider.handle = this.world.createCollider(collider.colliderDescription, parent?.rBody).handle;

		collider.hasParentRigidBody = !!parent?.rBody;

		this.colliders.set(collider.handle, { component: collider });
	}

	getCollider(handle?: number): Rapier.Collider | undefined
	{
		if(!handle) return undefined;
		return this.world?.getCollider(handle);
	}

	destroyCollider(collider: ColliderBehavior)
	{
		const c = collider.collider;
		if(!c) return;

		this.world!.removeCollider(c, true);

		this.colliders.delete(c.handle);
	}

	addRigidBody(rigidBody: RigidBodyBehavior)
	{
		ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
		ASSERT(rigidBody.parent, "RigidBodyBehavior has no parent.");

		rigidBody.handle = this.world.createRigidBody(rigidBody.rbodyDescription).handle;

		rigidBody.parent!.object3d.getWorldPosition(temp.v1);

		const rBody = this.world.getRigidBody(rigidBody.handle);

		rBody.setTranslation(temp.v1, true);

		rigidBody.parent!.object3d.getWorldQuaternion(temp.q1);

		rBody.setRotation(temp.q1, true);

		this.rigidBodies.set(rigidBody.handle, { component: rigidBody });

		const recurseAndRecreateColliders = (actor: Actor) =>
		{
			for(const c of actor.components)
			{
				if(c.type === "ColliderBehavior")
				{
					this.destroyCollider(c as ColliderBehavior);
					this.addCollider(c as ColliderBehavior);
				}
				if(isActor(c)) recurseAndRecreateColliders(c);
			}
		}

		recurseAndRecreateColliders(rigidBody.parent!);
	}

	getRigidBody(handle?: number): Rapier.RigidBody | undefined
	{
		if(typeof handle === "undefined") return undefined;
		return this.world?.getRigidBody(handle);
	}

	destroyRigidBody(rigidBody: RigidBodyBehavior)
	{
		if(!rigidBody.rBody) return;

		this.world?.removeRigidBody(rigidBody.rBody);

		this.rigidBodies.delete(rigidBody.handle ?? 0);

		const recurseAndDestroyColliders = (actor: Actor) =>
		{
			for(const c of actor.components)
			{
				if(c.type === "ColliderBehavior")
				{
					(c as ColliderBehavior).hasParentRigidBody = false;
					this.destroyCollider(c as ColliderBehavior);
					this.addCollider(c as ColliderBehavior);
				}
				if(isActor(c)) recurseAndDestroyColliders(c);
			}
		}
	}

	addCharacterController(args: { offset: number }): string
	{
		ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
		const player = this.world.createCharacterController(0.01);
		const uuid = Three.MathUtils.generateUUID();
		this.characterControllers.set(uuid, { instance: player });
		return uuid;
	}

	getCharacterController(handle?: string): Rapier.KinematicCharacterController | undefined
	{
		if(!handle) return undefined;
		return this.characterControllers.get(handle)?.instance;
	}

	destroyCharacterController(handle?: string)
	{
		if(!handle) return;
		const player = this.characterControllers.get(handle)?.instance;
		this.characterControllers.delete(handle);
		if(player && this.world) this.world.removeCharacterController(player);
	}

	updatePhysicsWorld(scene: Scene, delta: number, elapsed: number)
	{
		if(!this.world) return;

		// update manual transforms for colliders
		for(const c of this.colliders)
		{
			const parent = c[1].component.parent;
			if(!parent) continue;

			// the actor's world space location of the collider
			parent.object3d.getWorldPosition(temp.v1);

			const collider = this.getCollider(c[0]);
			if(!collider) continue;

			if(!c[1].component.hasParentRigidBody)
			{
				// position the collider where the actor is
				collider.setTranslation(temp.v1);
			}
			else
			{
				// find the ancestor rigid body
				const parentRigidBody = findAncestorRigidbody(parent);
				if(!parentRigidBody) throw new Error("Collider has no ancestor rigid body but hasParentRigidBody is true. This is a bug.");

				const parentBody = this.getRigidBody(parentRigidBody.rBody?.handle);
				if(!parentBody) throw new Error("Collider has no parent rigid body but hasParentRigidBody is true. This is a bug.");

				// find the parent body's world space location.
				const parentTransform = parentBody.translation();
				const parentRotation = temp.q1.set(parentBody.rotation().x, parentBody.rotation().y, parentBody.rotation().z, parentBody.rotation().w);

				// find the local space location of the collider
				temp.v2.copy(temp.v1).sub(parentTransform);
				temp.v2.applyQuaternion(parentRotation.invert());

				// set the collider's position to the local space location of the actor
				collider.setTranslationWrtParent(temp.v2);
				collider.setRotation(parentRotation);
			}
		}

		this.scene?._onBeforePhysicsUpdate(delta, elapsed);

		this.world.timestep = delta;
		this.world.step();

		// update rigid bodies after physics step
		for(const r of this.rigidBodies)
		{
			const body = this.world.getRigidBody(r[0]);
			if(!body) continue;

			// world space location of the rigid body
			const transform = body.translation();
			const rotation = temp.q1.set(body.rotation().x, body.rotation().y, body.rotation().z, body.rotation().w);

			if(r[1].component.parent)
			{
				r[1].component.parent.rotation.setFromQuaternion(rotation);
				// set the actor's position to the rigid body's position in world space
				r[1].component.parent.position.copy(transform);
			}
		}

		this.#debugRenderer.update();
	}

	destructor() {}

	#debugRenderer: PhysicsDebugRenderer;
}

function findAncestorRigidbody(actor?: Actor): RigidBodyBehavior | undefined
{
	if(!actor) return undefined;
	if(actor.type === "Scene") return undefined;

	let rb = actor.getComponentsByType(RigidBodyBehavior);
	if(rb.first) return rb.first
	if(!actor.parent || actor.parent.type === "Scene") return undefined;
	rb = actor.parent.getComponentsByType(RigidBodyBehavior);
	if(rb.first) return rb.first
	return findAncestorRigidbody(actor.parent);
}