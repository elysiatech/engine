import { Actor } from "./Actor.ts";
import * as Three from "three";
import { Destroyable, SceneLifecycle } from "../Core/Lifecycle.ts";
import { Future } from "../Containers/Future.ts";
import { bound, Constructor, noop } from "../Core/Utilities.ts";
import { Behavior } from "./Behavior.ts";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.ts";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent, TagRemovedEvent } from "../Core/ElysiaEvents.ts";
import { ActiveCameraTag } from "../Core/Tags.ts";
import { Component, isActor } from "./Component.ts";
import { ELYSIA_LOGGER } from "../Core/Logger.ts";
import { GridActor } from "../Actors/GridActor.ts";
import { ComponentSet } from "../Containers/ComponentSet.ts";
import { PhysicsController } from "../Physics/PhysicsController.ts";
import { EnvironmentActor } from "../Actors/EnvironmentActor.ts";
import { ActiveCamera, Internal, OnLoad, SceneLoadPromise } from "../Core/Internal.ts";

export const IsScene = Symbol.for("Elysia::IsScene");

export class Scene extends Actor<Three.Scene> implements SceneLifecycle, Destroyable
{
	[IsScene] = true;

	override type = "Scene";

	physics?: PhysicsController;

	get grid() { return this.#grid; }

	get ambientLight() { return this.#ambientLight; }

	get activeCamera() { return this.getActiveCamera(); }

	set activeCamera(camera: Three.Camera | Actor<Three.Camera>)
	{
		this[ActiveCamera] = camera instanceof Actor ? camera.object3d : camera;
		this.app?.renderPipeline.onCameraChange(this[ActiveCamera]);
	}

	constructor()
	{
		super();

		this.object3d = this[Internal].object3d = new Three.Scene();
		this[Internal].scene = this;

		ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {
			const type = e.child.constructor;

			if(!this.#componentsByType.has(type))
				this.#componentsByType.set(type, new ComponentSet);

			this.#componentsByType.get(type)!.add(e.child);

			if(isActor(e.child))
			{
				this.#allActors.add(e.child);
			}
			else
			{
				this.#allBehaviors.add(e.child);
			}
		})

		ElysiaEventDispatcher.addEventListener(ComponentRemovedEvent, (e) => {
			const type = e.child.constructor;
			this.#componentsByType.get(type)?.delete(e.child);

			if(isActor(e.child))
			{
				this.#allActors.delete(e.child);
			}
			else
			{
				this.#allBehaviors.delete(e.child);
			}
		})

		ElysiaEventDispatcher.addEventListener(TagAddedEvent, (event) => {
			if(!this.#componentsByTag.has(event.tag))
				this.#componentsByTag.set(event.tag, new ComponentSet);

			this.#componentsByTag.get(event.tag)!.add(event.target);
		})

		ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
			this.#componentsByTag.get(event.tag)?.delete(event.target);
		})
	}

	/**
	 * Returns all actors in the scene with the given tag.
	 * @param tag
	 */
	@bound public override getComponentsByTag(tag: any): ComponentSet<Component>
	{
		const set = this.#componentsByTag.get(tag);
		if(!set)
		{
			const newSet = new ComponentSet<Component>();
			this.#componentsByTag.set(tag, newSet);
			return newSet;
		}
		else return set;
	}

	/**
	 * Returns all actors in the scene with the given type.
	 */
	@bound public override getComponentsByType<T extends Actor | Behavior>(type: Constructor<T>): ComponentSet<T>
	{
		const set = this.#componentsByType.get(type);
		if(!set)
		{
			const newSet = new ComponentSet<T>();
			this.#componentsByType.set(type, newSet);
			return newSet;
		}
		else return set as ComponentSet<T>;
	}

	/**
	 * Returns the active camera in the scene (if one is set via ActiveCameraTag).
	 * If multiple cameras are set as active, the first one found is returned.
	 */
	@bound public getActiveCamera(): Three.Camera
	{
		return this[ActiveCamera];
	}

	@bound onLoad(): void | Promise<void> {}

	@bound onCreate() {
		ELYSIA_LOGGER.debug("Scene created", this)
		this.object3d.add(this.#ambientLight);
		this.#grid.disable();
		this.addComponent(this.#grid);
	}

	@bound onStart() {
		super.onStart();
		this.physics?.start();
	}

	@bound onUpdate(delta: number, elapsed: number) {
		super.onUpdate(delta, elapsed);
		const t = performance.now();
		this.physics?.updatePhysicsWorld(this, delta, elapsed)
		// console.log("Physics update time", performance.now() - t)
	}

	@bound onEnd(): void
	{
		this.#componentsByTag.clear();
		this.#componentsByType.clear();
	}

	@bound async [OnLoad]()
	{
		await Promise.all([this.onLoad(), this.physics?.init(this) ?? Promise.resolve()]);
		this[SceneLoadPromise].resolve()
	}

	[SceneLoadPromise] = new Future<void>(noop);
	[ActiveCamera]: Three.Camera = new Three.PerspectiveCamera();

	#grid = new GridActor;
	#ambientLight = new Three.AmbientLight(0xffffff, 0.5);
	#componentsByTag = new Map<any, ComponentSet<Component>>
	#componentsByType = new Map<any, ComponentSet<Component>>
	#allActors = new ComponentSet<Actor>
	#allBehaviors = new ComponentSet<Behavior>
}