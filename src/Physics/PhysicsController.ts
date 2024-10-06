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

		if(collider.collider)
		{
			this.world.removeCollider(collider.collider, true);
		}

		collider.handle = this.world.createCollider(collider.colliderDescription, parent?.rBody).handle;
		collider.hasParentRigidBody = !!parent?.rBody;

		if(!collider.hasParentRigidBody)
		{
			// collider.collider?.setTranslation(collider.parent.position);
			// collider.collider?.setRotation(new Three.Quaternion().setFromEuler(collider.parent.rotation));
		}

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

		this.world?.removeCollider(c, true);

		this.colliders.delete(c.handle);
	}

	addRigidBody(rigidBody: RigidBodyBehavior)
	{
		ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
		ASSERT(rigidBody.parent, "RigidBodyBehavior has no parent.");

		rigidBody.handle = this.world.createRigidBody(rigidBody.rbodyDescription).handle;

		const worldSpaceTransform = new Three.Vector3();

		rigidBody.parent!.object3d.getWorldPosition(worldSpaceTransform);

		const rBody = this.world.getRigidBody(rigidBody.handle);

		rBody.setTranslation(worldSpaceTransform, true);

		const worldSpaceQuaternion = new Three.Quaternion();

		rigidBody.parent!.object3d.getWorldQuaternion(worldSpaceQuaternion);

		rBody.setRotation(worldSpaceQuaternion, true);

		this.rigidBodies.set(rigidBody.handle, { component: rigidBody });

		const recurseAndRecreateColliders = (actor: Actor) =>
		{
			for(const c of actor.components)
			{
				if(c.type === "ColliderBehavior")
				{
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

	updatePhysicsWorld(scene: Scene, delta: number)
	{
		if(!this.world) return;

		this.world.timestep = delta;
		this.world.step();

		for(const r of this.rigidBodies)
		{
			const body = this.world.getRigidBody(r[0]);
			if(!body) continue;
			const transform = body.translation();
			const _rotation = body.rotation();
			const rotation = new Three.Quaternion(_rotation.x, _rotation.y, _rotation.z, _rotation.w);

			if(r[1].component.parent)
			{
				r[1].component.parent.rotation.setFromQuaternion(rotation);
				// need to set position of parent actor IN WORLD SPACE
				const pos = new Three.Vector3(transform.x, transform.y, transform.z);
				r[1].component.parent.position.copy(pos);
			}
		}

		const tempq = new Three.Quaternion();
		for(const [, { component }] of this.colliders)
		{
			if(!component.hasParentRigidBody && component.parent)
			{
				// component.collider?.setTranslation(component.parent.position);
				// component.collider?.setRotation(tempq.setFromEuler(component.parent.rotation));
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