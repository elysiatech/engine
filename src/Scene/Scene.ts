import { Actor } from "./Actor";
import * as Three from "three";
import { Destroyable, SceneLifecycle } from "../Core/Lifecycle";
import { Future } from "../Containers/Future";
import { noop } from "../Core/Utilities";
import { Behavior } from "./Behavior";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent, TagRemovedEvent } from "../Core/ElysiaEvents";
import { ActiveCameraTag } from "../Core/Tags";
import { ResizeEvent } from "../Core/Resize";
import { isActor } from "./Component";
import { Application } from "../Core/Application";

export class Scene extends Actor<Three.Scene> implements SceneLifecycle, Destroyable
{
	object3d: Three.Scene = new Three.Scene();

	app!: Application;

	constructor()
	{
		super();
		this.object3d.actor = this;

	}

	public getByTag(tag: any): Set<Actor | Behavior>
	{
		return this.byTag.get(tag) || new Set();
	}

	public getByType(type: any): Set<Actor | Behavior>
	{
		return this.byType.get(type) || new Set();
	}

	public getByObject3d(object3d: string): Set<Actor>
	{
		return this.byObject3d.get(object3d) || new Set();
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

	onLoad(): void | Promise<void> {
		ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {
			const type = e.child.constructor;

			if(!this.byType.has(type))
				this.byType.set(type, new Set());

			this.byType.get(type)!.add(e.child);

			if(isActor(e.child))
			{
				this.allActors.add(e.child);
				if(!this.byObject3d.has(e.child.object3d.type))
					this.byObject3d.set(e.child.object3d.type, new Set());

				this.byObject3d.get(e.child.object3d.type)!.add(e.child);
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

				if(!this.byObject3d.has(e.child.object3d.type))
					this.byObject3d.set(e.child.object3d.type, new Set());

				this.byObject3d.get(e.child.object3d.type)!.delete(e.child);
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
				this.app.renderPipeline.onCameraChange(this.getActiveCamera()!);
			}
		})

		ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
			this.byTag.get(event.tag)?.delete(event.target);
		})

		ElysiaEventDispatcher.addEventListener(ResizeEvent, (e) => {
			this.getByObject3d("PerspectiveCamera").forEach((actor) => {
				const camera = actor.object3d as Three.PerspectiveCamera;
				camera.aspect = e.x / e.y;
				camera.updateProjectionMatrix();
			})
		})
	}

	async _load()
	{
		await this.onLoad()
		this.loadPromise.resolve()
	}

	loadPromise = new Future<void>(noop)

	private byTag = new Map<any, Set<Actor | Behavior>>
	private byType = new Map<any, Set<Actor | Behavior>>
	private byObject3d = new Map<string, Set<Actor>>
	private allActors = new Set<Actor>()
	private allBehaviors = new Set<Behavior>()
}