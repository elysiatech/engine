import { Actor } from "./Actor";
import * as Three from "three";
import { Destroyable, SceneLifecycle } from "../Core/Lifecycle";
import { Future } from "../Containers/Future";
import { Constructor, noop } from "../Core/Utilities";
import { Behavior } from "./Behavior";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent, TagRemovedEvent } from "../Core/ElysiaEvents";
import { ActiveCameraTag } from "../Core/Tags";
import { Component, isActor } from "./Component";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { GridActor } from "../Actors/GridActor.ts";
import { SparseSet } from "../Containers/SparseSet.ts";
import { PhysicsController } from "../Physics/PhysicsController.ts";
import { EnvironmentActor } from "../Actors/EnvironmentActor.ts";

export class Scene extends Actor<Three.Scene> implements SceneLifecycle, Destroyable
{
	override type = "Scene";

	readonly loadPromise = new Future<void>(noop)

	get grid() { return this.#grid; }

	get ambientLight() { return this.#ambientLight; }

	physics?: PhysicsController;

	get activeCamera() { return this.getActiveCamera(); }
	set activeCamera(camera: Three.Camera | Actor<Three.Camera>)
	{
		this.#activeCamera = camera instanceof Actor ? camera.object3d : camera;
		this.app?.renderPipeline.onCameraChange(this.#activeCamera);
	}

	constructor()
	{
		super();
		this.object3d = this.#object3d;
		this.scene = this;

		this.#grid.disable();
		this.addComponent(this.#grid);

		ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {
			const type = e.child.constructor;

			if(!this.componentsByType.has(type))
				this.componentsByType.set(type, new SparseSet);

			this.componentsByType.get(type)!.add(e.child);

			if(isActor(e.child))
			{
				this.allActors.add(e.child);
			}
			else
			{
				this.allBehaviors.add(e.child);
			}
		})

		ElysiaEventDispatcher.addEventListener(ComponentRemovedEvent, (e) => {
			const type = e.child.constructor;
			this.componentsByType.get(type)?.delete(e.child);

			if(isActor(e.child))
			{
				this.allActors.delete(e.child);
			}
			else
			{
				this.allBehaviors.delete(e.child);
			}
		})

		ElysiaEventDispatcher.addEventListener(TagAddedEvent, (event) => {
			if(!this.componentsByTag.has(event.tag))
				this.componentsByTag.set(event.tag, new SparseSet);

			this.componentsByTag.get(event.tag)!.add(event.target);
		})

		ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
			this.componentsByTag.get(event.tag)?.delete(event.target);
		})
	}

	/**
	 * Returns all actors in the scene with the given tag.
	 * @param tag
	 */
	public override getComponentsByTag(tag: any): SparseSet<Component>
	{
		return this.componentsByTag.get(tag) || new SparseSet<Component>;
	}

	/**
	 * Returns all actors in the scene with the given type.
	 */
	public override getComponentsByType<T extends Actor | Behavior>(type: Constructor<T>): SparseSet<T>
	{
		return (this.componentsByType.get(type) as SparseSet<T>) || new SparseSet<T>;
	}

	/**
	 * Returns the active camera in the scene (if one is set via ActiveCameraTag).
	 * If multiple cameras are set as active, the first one found is returned.
	 */
	public getActiveCamera(): Three.Camera
	{
		return this.#activeCamera;
	}

	onLoad(): void | Promise<void> {}

	async _load()
	{
		await Promise.all([this.onLoad(), this.physics?.init(this) ?? Promise.resolve()]);
		this.loadPromise.resolve()
	}

	onCreate() {
		ELYSIA_LOGGER.debug("Scene created", this)
		this.object3d.add(this.#ambientLight);
	}

	onStart() {
		super.onStart();
		this.physics?.start();
	}

	onUpdate(delta: number, elapsed: number) {
		super.onUpdate(delta, elapsed);
		const t = performance.now();
		this.physics?.updatePhysicsWorld(this, delta, elapsed)
		// console.log("Physics update time", performance.now() - t)
	}

	onEnd(): void
	{
		this.componentsByTag.clear();
		this.componentsByType.clear();
	}

	private componentsByTag = new Map<any, SparseSet<Component>>
	private componentsByType = new Map<any, SparseSet<Component>>
	private allActors = new SparseSet<Actor>
	private allBehaviors = new SparseSet<Behavior>

	#activeCamera: Three.Camera = new Three.PerspectiveCamera();

	#object3d: Three.Scene = new Three.Scene();

	#grid = new GridActor;

	#ambientLight = new Three.AmbientLight(0xffffff, 0.5);
}