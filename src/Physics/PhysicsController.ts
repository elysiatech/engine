import { Scene } from "../Scene/Scene";
import * as Three from "three"
import { ColliderBehavior } from "./ColliderBehavior.ts";
import { RigidBodyBehavior } from "./RigidBody";
import { ComponentAddedEvent, ComponentRemovedEvent } from "../Core/ElysiaEvents";
import { Destroyable, } from "../Core/Lifecycle";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
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

export class PhysicsController implements Destroyable
{
	world?: Rapier.World;

	readonly gravity: Three.Vector3;

	readonly colliders = new Set<{ component: ColliderBehavior, parent?: Actor, handle?: number }>;

	readonly rigidBodies = new Set<{ component: RigidBodyBehavior, parent?: Actor, handle: number }>;

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
		collider.collider = this.world!.createCollider(collider.colliderDescription, parent?.rBody);
		this.colliders.add({ component: collider, parent: collider.parent!, handle: collider.collider.handle });
	}

	addRigidBody(rigidBody: RigidBodyBehavior)
	{
		// todo: need to reconstruct all children rigidbodies and colliders
		ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
		ASSERT(rigidBody.parent, "RigidBodyBehavior has no parent.");
		rigidBody.rBody = this.world.createRigidBody(rigidBody.rbodyDescription);

		const worldSpaceTransform = new Three.Vector3();

		rigidBody.parent!.object3d.getWorldPosition(worldSpaceTransform);

		rigidBody.rBody.setTranslation(worldSpaceTransform, true);

		const worldSpaceQuaternion = new Three.Quaternion();

		rigidBody.parent!.object3d.getWorldQuaternion(worldSpaceQuaternion);

		rigidBody.rBody.setRotation(worldSpaceQuaternion, true);

		this.rigidBodies.add({ component: rigidBody, handle: rigidBody.rBody.handle });

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

	updatePhysicsWorld(scene: Scene, delta: number)
	{
		if(!this.world) return;

		this.world.timestep = delta;
		this.world.step();

		for(const r of this.rigidBodies)
		{
			const body = this.world.getRigidBody(r.handle);
			const transform = body.translation();
			const _rotation = body.rotation();
			const rotation = new Three.Quaternion(_rotation.x, _rotation.y, _rotation.z, _rotation.w);

			if(r.component.parent)
			{
				r.component.parent.rotation.setFromQuaternion(rotation);
				// need to set position of parent actor IN WORLD SPACE
				const pos = new Three.Vector3(transform.x, transform.y, transform.z);
				r.component.parent.position.copy(pos);

			}
		}

		this.#debugRenderer.update();
	}

	destructor() {
	}

	#debugRenderer: PhysicsDebugRenderer;
}