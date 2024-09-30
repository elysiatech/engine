import { Actor } from "./Actor";
import * as Three from "three";
import { Destroyable, SceneLifecycle } from "../Core/Lifecycle";
import { Future } from "../Containers/Future";
import { Constructor, noop } from "../Core/Utilities";
import { Behavior } from "./Behavior";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent, TagRemovedEvent } from "../Core/ElysiaEvents";
import { ActiveCameraTag } from "../Core/Tags";
import { isActor } from "./Component";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { GridActor } from "../Actors/GridActor.ts";

export class Scene extends Actor<Three.Scene> implements SceneLifecycle, Destroyable
{
	readonly loadPromise = new Future<void>(noop)

	get object3d() { return this.#object3d; }

	get grid() { return this.#grid; }

	constructor()
	{
		super();
		this.object3d.actor = this;
		this.scene = this;

		this.#grid.disable();
		this.addComponent(this.#grid);

		ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {
			const type = e.child.constructor;

			if(!this.componentsByType.has(type))
				this.componentsByType.set(type, new Set());

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
				this.componentsByTag.set(event.tag, new Set());

			this.componentsByTag.get(event.tag)!.add(event.target);

			if(event.tag === ActiveCameraTag && isActor(event.target))
			{
				this.app?.renderPipeline.onCameraChange(this.getActiveCamera()!);
			}
		})

		ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
			this.componentsByTag.get(event.tag)?.delete(event.target);
		})
	}

	/**
	 * Returns all actors in the scene with the given tag.
	 * @param tag
	 */
	public override getComponentsByTag(tag: any): Set<Actor | Behavior>
	{
		return this.componentsByTag.get(tag) || new Set();
	}

	/**
	 * Returns all actors in the scene with the given type.
	 */
	public override getComponentsByType<T extends Actor | Behavior>(type: Constructor<T>): Set<T>
	{
		return (this.componentsByType.get(type) as Set<T>) || new Set<T>();
	}

	/**
	 * Returns the active camera in the scene (if one is set via ActiveCameraTag).
	 */
	public getActiveCamera(): Three.Camera | null
	{
		return this.getComponentsByTag(ActiveCameraTag).values()?.next()?.value?.object3d || null;
	}

	onLoad(): void | Promise<void> {}

	async _load()
	{
		await this.onLoad()
		this.loadPromise.resolve()
	}

	onCreate() {
		ELYSIA_LOGGER.debug("Scene created", this)
	}

	onEnd(): void
	{
		this.componentsByTag.clear();
		this.componentsByType.clear();
	}

	private componentsByTag = new Map<any, Set<Actor | Behavior>>
	private componentsByType = new Map<any, Set<Actor | Behavior>>
	private allActors = new Set<Actor>()
	private allBehaviors = new Set<Behavior>()

	#object3d: Three.Scene = new Three.Scene();

	#grid = new GridActor;
}