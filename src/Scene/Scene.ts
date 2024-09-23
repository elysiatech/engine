import { Actor } from "./Actor";
import * as Three from "three";
import { Destroyable, SceneLifecycle } from "../Core/Lifecycle";
import { Future } from "../Containers/Future";
import { noop } from "../Core/Utilities";
import { Behavior } from "./Behavior";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent, TagRemovedEvent } from "../Core/ElysiaEvents";
import { ActiveCameraTag } from "../Core/Tags";

export class Scene extends Actor<Three.Scene> implements SceneLifecycle, Destroyable
{
	object3d: Three.Scene = new Three.Scene();

	constructor()
	{
		super();
		this.object3d.actor = this;

		ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {;
			const type = e.child.constructor;

			if(!this.byType.has(type))
				this.byType.set(type, new Set());

			this.byType.get(type)!.add(e.child);
		})

		ElysiaEventDispatcher.addEventListener(ComponentRemovedEvent, (e) => {
			const type = e.child.constructor;
			this.byType.get(type)?.delete(e.child);
		})

		ElysiaEventDispatcher.addEventListener(TagAddedEvent, (event) => {
			if(!this.byTag.has(event.tag))
				this.byTag.set(event.tag, new Set());

			this.byTag.get(event.tag)!.add(event.target);
		})

		ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
			this.byTag.get(event.tag)?.delete(event.target);
		})
	}

	public getByTag(tag: any): Set<Actor | Behavior>
	{
		return this.byTag.get(tag) || new Set();
	}

	public getByType(type: any): Set<Actor | Behavior>
	{
		return this.byType.get(type) || new Set();
	}

	public getActors(): Set<Actor>
	{
		return this.getByType(Actor) as Set<Actor>;
	}

	public getActiveCamera(): Three.Camera | null
	{
		return this.getByTag(ActiveCameraTag).values().next().value.object3d || null;
	}

	onDestroy(): void
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

	loadPromise = new Future<void>(noop)

	private byTag = new Map<any, Set<Actor | Behavior>>
	private byType = new Map<any, Set<Actor | Behavior>>
}