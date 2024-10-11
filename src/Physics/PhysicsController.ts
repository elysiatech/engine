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
import { findAncestorRigidbody } from "./FindAncestorRigidbody.ts";
import { OnBeforePhysicsUpdate } from "../Core/Internal.ts";

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

	queue?: Rapier.EventQueue;

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

		this.queue = new Rapier.EventQueue(false);
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

		if(!collider.colliderDescription) return;

		collider.handle = this.world.createCollider(collider.colliderDescription, parent?.rBody).handle;

		collider.hasParentRigidBody = !!parent?.rBody;

		this.colliders.set(collider.handle, { component: collider });
	}

	getCollider(handle?: number): Rapier.Collider | undefined
	{
		if(typeof handle === "undefined") return undefined;
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

		this.scene?.[OnBeforePhysicsUpdate](delta, elapsed);

		this.world.timestep = delta;

		this.world.step(this.queue!);

		// sync the rigid bodies with the world
		for(const r of this.rigidBodies)
		{
			const body = this.world.getRigidBody(r[0]);
			if(!body) continue;

			// world space location of the rigid body
			const transform = temp.v1.copy(body.translation());
			const rotation = temp.q1.copy(body.rotation())

			if(r[1].component.parent)
			{
				if(r[1].component.parent.parent?.object3d)
				{
					// use parent space
					r[1].component.parent.parent.object3d.worldToLocal(transform);
					r[1].component.parent.position.copy(transform);

					r[1].component.parent.parent.object3d.getWorldQuaternion(temp.q2)
					temp.q2.invert();
					rotation.premultiply(temp.q2);
					r[1].component.parent.quaternion.copy(rotation);
				}
				else
				{
					// we are at the root, using worldspace
					r[1].component.parent.object3d.position.copy(transform);
					r[1].component.parent.object3d.quaternion.copy(rotation);
				}
			}
		}

		this.queue!.drainCollisionEvents((handle1, handle2, started) =>
		{
			const c1 = this.colliders.get(handle1);
			const c2 = this.colliders.get(handle2);
			if(!c1 || !c2) return;
			c1.component.onCollision?.(c2.component, started)
			c2.component.onCollision?.(c1.component, started)
		});

		this.queue!.drainContactForceEvents((e) =>
		{
			const c1 = this.colliders.get(e.collider1())
			const c2 = this.colliders.get(e.collider2())
			if(!c1 || !c2) return;
			c1.component.onContact?.(c2.component, e.maxForceDirection(), e.maxForceMagnitude(), e.totalForce(), e.totalForceMagnitude())
			c2.component.onContact?.(c2.component, e.maxForceDirection(), e.maxForceMagnitude(), e.totalForce(), e.totalForceMagnitude())
		})

		this.queue!.clear();

		this.#debugRenderer.update();
	}

	destructor() {}

	#debugRenderer: PhysicsDebugRenderer;
}
