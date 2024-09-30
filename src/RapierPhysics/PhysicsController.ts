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
import { Actor } from "../Scene/Actor";

export interface RapierPhysicsControllerConstructorArguments
{
	gravity?: Three.Vector3;
	debug?: boolean;
}

export class RapierPhysicsController implements Destroyable
{
	world?: Rapier.World;

	readonly gravity: Three.Vector3;

	readonly colliders = new Set<{ component: RapierColliderBehavior, parent?: Actor, handle?: number }>;

	readonly rigidBodies = new Set<{ component: RapierRigidBodyBehavior, parent?: Actor, handle: number }>;

	scene?: Scene;

	get debug() { return this.#debugRenderer.enabled; }
	set debug(value: boolean) { this.#debugRenderer.enabled = value; }

	constructor(args: RapierPhysicsControllerConstructorArguments = {})
	{
		this.init = this.init.bind(this);
		this.updatePhysicsWorld = this.updatePhysicsWorld.bind(this);
		this.gravity = args.gravity ?? new Three.Vector3(0, -9.81, 0)

		this.#debugRenderer = new RapierDebugRenderer(args.debug);
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
		// const colliders = this.scene.getComponentsByType(RapierBoxColliderBehavior);
		//
		// for(const c of colliders)
		// {
		// 	if(!c.parent) continue;
		//
		// 	if(!c.parent.getComponentsByType(RapierRigidBodyBehavior).size)
		// 	{
		// 		// no sibiling rigid body, so we can go ahead and create this collider now
		// 		const collider = this.world.createCollider(c.description);
		// 		collider.setTranslation(c.parent.position.clone().add(c.localPosition ?? new Three.Vector3(0, 0, 0)));
		// 		this.colliders.add({ component: c, parent: c.parent! });
		// 	}
		// }
		//
		// // find all entities and create their physics objects
		// const rigidBodies = this.scene.getComponentsByType(RapierRigidBodyBehavior);
		//
		// for(const rb of rigidBodies)
		// {
		// 	if(!rb.parent) continue;
		//
		// 	const body = this.world.createRigidBody(rb.desc);
		//
		// 	const associatedColliders = rb.parent.getComponentsByType(RapierBoxColliderBehavior);
		//
		// 	for(const c of associatedColliders)
		// 	{
		// 		const collider = this.world.createCollider(c.description, body);
		// 		if(c.localPosition)
		// 		{
		// 			collider.setTranslationWrtParent(new Rapier.Vector3(c.localPosition.x, c.localPosition.y, c.localPosition.z));
		// 		}
		// 		this.colliders.add({ component: c, parent: rb.parent, handle: collider.handle });
		// 	}
		//
		// 	const worldSpaceTransform = new Three.Vector3();
		// 	rb.parent!.object3d.getWorldPosition(worldSpaceTransform);
		// 	body.setTranslation(worldSpaceTransform, true);
		//
		// 	const worldSpaceQuaternion = new Three.Quaternion();
		// 	rb.parent!.object3d.getWorldQuaternion(worldSpaceQuaternion);
		// 	body.setRotation(worldSpaceQuaternion, true);
		//
		// 	this.rigidBodies.add({ component: rb, handle: body.handle });
		// }
		//
		// this.#debugRenderer.start(this.scene.object3d, this.world);
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

	#debugRenderer: RapierDebugRenderer;
}