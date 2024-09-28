import { Scene } from "../Scene/Scene";
import * as Three from "three"
import { RapierColliderBehavior } from "./Collider";
import { RapierRigidBodyBehavior } from "./RigidBody";
import { World as PhysicsWorld } from "@dimforge/rapier3d";
import { ComponentAddedEvent, ComponentRemovedEvent } from "../Core/ElysiaEvents";
import { Destroyable } from "../Core/Lifecycle";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";

export interface RapierPhysicsControllerConstructorArguments
{
	gravity?: Three.Vector3;
}

export class RapierPhysicsController implements Destroyable
{
	r!: typeof import('@dimforge/rapier3d')

	world!: PhysicsWorld;

	readonly gravity: Three.Vector3;

	readonly colliders = new Set<{ component: RapierColliderBehavior, handle: number }>;

	readonly rigidBodies = new Set<{ component: RapierRigidBodyBehavior, handle: number }>;

	constructor(args: RapierPhysicsControllerConstructorArguments = {})
	{
		this.init = this.init.bind(this);
		this.updatePhysicsWorld = this.updatePhysicsWorld.bind(this);
		this.gravity = args.gravity ?? new Three.Vector3(0, -9.81, 0)
	}

	async init()
	{
		this.r = await import('@dimforge/rapier3d');
		this.world = new this.r.World(this.gravity);

		ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, this.#onComponentAddedEventHandler);
		ElysiaEventDispatcher.addEventListener(ComponentRemovedEvent, this.#onComponentRemovedEventHandler);
	}

	updatePhysicsWorld(scene: Scene)
	{
		const colliders = scene.getComponentByType(RapierColliderBehavior)
		const rigidBodies = scene.getComponentByType(RapierRigidBodyBehavior)

		for(const c of colliders)
		{

		}

		for(const r of rigidBodies)
		{

		}
	}

	destructor()
	{
		ElysiaEventDispatcher.removeEventListener(ComponentAddedEvent, this.#onComponentAddedEventHandler);
		ElysiaEventDispatcher.removeEventListener(ComponentRemovedEvent, this.#onComponentRemovedEventHandler);
	}

	#onComponentAddedEventHandler(e: ComponentAddedEvent["value"])
	{
		if(e.child.type !== "RapierColliderBehavior" && e.child.type !== "RapierRigidBodyBehavior") return;
	}

	#onComponentRemovedEventHandler(e: ComponentRemovedEvent["value"])
	{
		if(e.child.type !== "RapierColliderBehavior" && e.child.type !== "RapierRigidBodyBehavior") return;
	}
}