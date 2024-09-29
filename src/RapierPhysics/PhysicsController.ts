import { Scene } from "../Scene/Scene";
import * as Three from "three"
import { RapierColliderBehavior } from "./Collider";
import { RapierRigidBodyBehavior } from "./RigidBody";
import { ComponentAddedEvent, ComponentRemovedEvent } from "../Core/ElysiaEvents";
import { Destroyable, } from "../Core/Lifecycle";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import Rapier from '@dimforge/rapier3d-compat'
import { ELYSIA_LOGGER } from "../Core/Logger";
import { RapierDebugRenderer } from "./Debug";

export interface RapierPhysicsControllerConstructorArguments
{
	gravity?: Three.Vector3;
}

export class RapierPhysicsController implements Destroyable
{
	world!: Rapier.World;

	readonly gravity: Three.Vector3;

	readonly colliders = new Set<{ component: RapierColliderBehavior, handle: number }>;

	readonly rigidBodies = new Set<{ component: RapierRigidBodyBehavior, handle: number }>;

	scene!: Scene;

	constructor(args: RapierPhysicsControllerConstructorArguments = {})
	{
		this.init = this.init.bind(this);
		this.updatePhysicsWorld = this.updatePhysicsWorld.bind(this);
		this.gravity = args.gravity ?? new Three.Vector3(0, -9.81, 0)
	}

	async init(scene: Scene)
	{
		await Rapier.init();

		this.world = new Rapier.World(this.gravity);
		this.scene = scene;

		ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, this.#onComponentAddedEventHandler);
		ElysiaEventDispatcher.addEventListener(ComponentRemovedEvent, this.#onComponentRemovedEventHandler);
	}

	start()
	{
		// find all entities and create their physics objects
		const rigidBodies = this.scene.getComponentsByType(RapierRigidBodyBehavior);

		for(const rb of rigidBodies)
		{
			rb.desc.setAdditionalMass(0.5)

			const collider = Rapier.ColliderDesc.cuboid(.5, .5, .5);

			const body = this.world.createRigidBody(rb.desc);

			body.addForce(new Rapier.Vector3(.3, 0, 0), true);
			body.addTorque(new Rapier.Vector3(0, 0, 1), true);

			this.world.createCollider(collider, body);

			const worldSpaceTransform = new Three.Vector3();
			rb.parent!.object3d.getWorldPosition(worldSpaceTransform);
			body.setTranslation(worldSpaceTransform, true);

			const worldSpaceQuaternion = new Three.Quaternion();
			rb.parent!.object3d.getWorldQuaternion(worldSpaceQuaternion);
			body.setRotation(worldSpaceQuaternion, true);

			this.rigidBodies.add({ component: rb, handle: body.handle });
		}

		const collider = Rapier.ColliderDesc.cuboid(5, .1, 5);
		const c = this.world.createCollider(collider);
		c.setTranslation(new Rapier.Vector3(0, -.1, 0));

		this.#debugRenderer.start(this.scene.object3d, this.world);
	}

	updatePhysicsWorld(scene: Scene, delta: number)
	{
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

	destructor()
	{
		ElysiaEventDispatcher.removeEventListener(ComponentAddedEvent, this.#onComponentAddedEventHandler);
		ElysiaEventDispatcher.removeEventListener(ComponentRemovedEvent, this.#onComponentRemovedEventHandler);
	}

	#onComponentAddedEventHandler(e: ComponentAddedEvent["value"])
	{
		if(!e.child.started) return
		if(e.child.type !== "RapierColliderBehavior" && e.child.type !== "RapierRigidBodyBehavior") return;

		// the child has started, which means it's initial physical properties have been added to the physics world.
		// we need to handle modifications, such as adding a collider or rigid body to the physics world.
	}

	#onComponentRemovedEventHandler(e: ComponentRemovedEvent["value"])
	{
		if(!e.child.started) return;
		if(e.child.type !== "RapierColliderBehavior" && e.child.type !== "RapierRigidBodyBehavior") return;

		// the child has started, which means it's initial physical properties have been added to the physics world.
		// we need to handle modifications, such as adding a collider or rigid body to the physics world.
	}

	#debugRenderer = new RapierDebugRenderer(false);
}