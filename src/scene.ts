import * as Three from "three";
import type { Actor } from "./actor";
import { SceneActor } from "./actors/SceneActor";
import type { Behavior } from "./behavior";
import { ActiveCameraTag } from "./tags";
import { Application } from "./application";
import { RenderPipeline } from "./render_pipeline";
import { PointerIntersections } from "./pointer_intersections";

export abstract class Scene {

	public app: Application;

	public root = new SceneActor;	

	public getPointerIntersections(){ return this.pointer.intersections; }

	constructor(app: Application){
		this.app = app;
		this.root.app = app;
		this.root.scene = this;
	}

	public async init(){
		// handle initialization of scene
	}

	public onPlay(){
		// handle onPlay
		this.root.onCreate();
		this.root.onSpawn();
	}

	public onUpdate(delta: number, elapsed: number){

		this.pointer.cast(
			this.app.getPointerPosition(), 
			this.getActiveCamera()?.getComponent(Three.Camera)!, 
			this.root
		);

		this.root.onUpdate(delta, elapsed);
	}

	// user needs to run this
	public abstract render(renderer: RenderPipeline, delta: number, elapsed: number): Promise<void>;

	public destructor(){
		// handle destruction of scene
		this.destroyed = true;
		for(const destroyable of this.destroyables) destroyable();
		this.root.despawn();
		this.root.destroy();
	}

	public findByTag(tag: string | symbol | number): Set<Actor | Behavior> {
		return this.tagCollections.get(tag) ?? new Set;
	}

	public findById(id: string | symbol | number): Actor | Behavior | undefined {
		return this.idCollection.get(id);
	}

	public getActiveCamera(): Actor<Three.Camera> | undefined {
		return this.findByTag(ActiveCameraTag).values().next().value;
	}

	public setActiveCamera(actor: Actor): void {
		const current = this.getActiveCamera();
		if (current) {
			current.removeTag(ActiveCameraTag);
		}
		actor.addTag(ActiveCameraTag);
	}

	protected destroyOnUnload(...fn: Function[]){
		for(const f of fn) this.destroyables.add(f);
	}

	private tagCollections = new Map<string | number | symbol, Set<Actor | Behavior>>

	private idCollection = new Map<string | number | symbol, Actor | Behavior>

	private pointer = new PointerIntersections;

	private destroyed = false;

	private destroyables = new Set<Function>();
}
