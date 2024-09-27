import { Actor } from "./Actor";
import * as Three from "three";
import { Destroyable, SceneLifecycle } from "../Core/Lifecycle";
import { Future } from "../Containers/Future";
import { noop } from "../Core/Utilities";
import { Behavior } from "./Behavior";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent, TagRemovedEvent } from "../Core/ElysiaEvents";
import { ActiveCameraTag } from "../Core/Tags";
import { isActor } from "./Component";
import { ELYSIA_LOGGER } from "../Core/Logger";

export class Scene extends Actor<Three.Scene> implements SceneLifecycle, Destroyable
{
	get object3d() { return this.#object3d; }

	constructor()
	{
		super();
		this.object3d.actor = this;
		this.scene = this;

		ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {
			const type = e.child.constructor;

			if(!this.byType.has(type))
				this.byType.set(type, new Set());

			this.byType.get(type)!.add(e.child);

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
			this.byType.get(type)?.delete(e.child);

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
			if(!this.byTag.has(event.tag))
				this.byTag.set(event.tag, new Set());

			this.byTag.get(event.tag)!.add(event.target);

			if(event.tag === ActiveCameraTag && isActor(event.target))
			{
				this.app?.renderPipeline.onCameraChange(this.getActiveCamera()!);
			}
		})

		ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
			this.byTag.get(event.tag)?.delete(event.target);
		})
	}

	public getComponentByTag(tag: any): Set<Actor | Behavior>
	{
		return this.byTag.get(tag) || new Set();
	}

	public getComponentByType(type: any): Set<Actor | Behavior>
	{
		return this.byType.get(type) || new Set();
	}

	public getActiveCamera(): Three.Camera | null
	{
		return this.getComponentByTag(ActiveCameraTag).values()?.next()?.value?.object3d || null;
	}

	onEnd(): void
	{
		this.byTag.clear();
		this.byType.clear();
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

	loadPromise = new Future<void>(noop)

	private byTag = new Map<any, Set<Actor | Behavior>>
	private byType = new Map<any, Set<Actor | Behavior>>
	private allActors = new Set<Actor>()
	private allBehaviors = new Set<Behavior>()

	#object3d: Three.Scene = new Three.Scene();
}