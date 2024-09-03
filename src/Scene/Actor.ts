import * as Three from "three";
import { isActor, isBehavior } from "../Core/Assert";
import { Behavior } from "./Behavior";
import { destroyObject3D } from "../Utils/DestroyObject3D";
import type { Scene } from "./Scene";
import { Application } from "../Core/Application";

export class Actor<T extends Three.Object3D = Three.Object3D> {

	public get isActor() { return true; }

	public id?: string | symbol | number;

	public tags = new Set<string | symbol | number>();

	public object3d: T;

	public parent: Actor | null = null;

	public scene: Scene | null = null;

	public app: Application | null = null;

	public get position() { return this.object3d.position; }

	public get rotation() { return this.object3d.rotation; }

	public get scale() { return this.object3d.scale; }

	public get quaternion() { return this.object3d.quaternion; }

	public get matrix() { return this.object3d.matrix; }

	public get visible() { return this.object3d.visible; }

	public set visible(value: boolean) { this.object3d.visible = value; }

	public readonly components: Set<Actor | Behavior> = new Set();

	public initialized = false;

	public spawned = false;

	public destroyed = false;

	constructor() {
		this.object3d = new Three.Object3D() as T;
		this.object3d.userData.owner = this;
	}

	addComponent<T extends Actor | Behavior>(component: T): this {

		if (this.destroyed) return this;

		if (isActor(component.parent)) {
			component.parent.removeComponent(component);
		}


		this.components.add(component);

		component.parent = this;
		component.scene = this.scene;

		if (isActor(component)) {
			this.object3d.add(component.object3d);

			if (component.id) {
				// handle id in scene
			}

			if (component.tags) {
				// handle tags in scene
			}
		}

		if (isBehavior(component)) {
			if (component.id) {
				// handle id in scene
			}

			if (component.tags) {
				for (const tag of component.tags) {
					// handle tags in scene
				}
			}
		}

		if (this.initialized) {
			component.create();
		}

		if (this.spawned) {
			component.spawn();
		}

		return this;
	}

	removeComponent<T extends Actor | Behavior>(component: T): T {
		if (this.destroyed) return component;

		component.parent = null;

		this.components.delete(component);

		if (isActor(component)) {
			this.object3d.remove(component.object3d);

			if (component.id) {
				// handle scene id
			}

			if (component.tags) {
				for (const tag of component.tags) {
					// handle scene tags
				}
			}
		}

		return component;
	}

	addTag(tag: string | symbol): this {
		this.tags.add(tag);
		// handle scene tags
		return this;
	}

	removeTag(tag: string | symbol): this {
		this.tags.delete(tag);
		// handle scene tags
		return this;
	}

	create() {
		if (this.initialized || this.destroyed || !this.scene || !this.scene.app) return;

		this.object3d.userData.owner = this;

		this.onCreate();

		this.initialized = true;

		for (const component of this.components) {
			component.scene = this.scene;
			component.create();
		}
	}

	spawn() {
		if (this.spawned || this.destroyed) return;
		this.onSpawn();
		this.spawned = true;
		this.parent?.object3d.add(this.object3d);
		for (const component of this.components) {
			component.spawn();
		}
	}

	update(frametime: number, elapsedtime: number) {
		if (!this.spawned || this.destroyed) return;
		this.onUpdate(frametime, elapsedtime);
		for (const component of this.components) {
			component.update(frametime, elapsedtime);
		}
	}

	despawn() {
		if (!this.spawned || this.destroyed) return;
		this.onDespawn();
		this.parent?.object3d.remove(this.object3d);
		for (const component of this.components) {
			component.despawn();
		}
	}

	destroy() {
		if (this.destroyed) return;
		this.destructor();
		this.destroyed = true;
		destroyObject3D(this.object3d);
		for (const component of this.components) {
			component.despawn();
			component.destroy();
		}
	}

	resize(bounds: DOMRect) {
		if (!this.initialized || this.destroyed) return;
		this.onResize(bounds);
		for (const component of this.components) {
			component.resize(bounds);
		}
	}

	onCreate(): void {}

	onSpawn(): void {}

	onUpdate(frametime: number, elapsedtime: number): void {}

	onDespawn(): void {}

	onResize(bounds: DOMRect): void {}

	destructor(): void {
		this.disposables.forEach((fn) => fn());

		for (const component of this.components) {
			component.destroy();
		}
		this.components.clear();
		this.scene = null;
		this.parent = null;
		this.initialized = false;
		this.spawned = false;
		this.destroyed = true;
		this.tags.clear();
		this.disposables.forEach((fn) => fn());
		this.disposables.length = 0;
	}

	dispose(...callbacks: (() => void)[]) {
		this.disposables.push(...callbacks);
	}

	*componentIterator(): IterableIterator<Actor | Behavior> {
		for (const component of this.components) {
			yield component;
		}
	}

	getComponentsByTag(tag: string | symbol): Set<Actor | Behavior> {
		// todo: make readonly

		if(!this.tagSetCache.has(tag)) {
			this.tagSetCache.set(tag, new Set());
		}

		const container = this.tagSetCache.get(tag)!;

		container.clear();

		for (const component of this.components) {
			if (component.tags.has(tag)) {
				container.add(component);
			}
		}

		return container;
	}

	getComponents<T extends Actor | Behavior>(type: new () => T): Set<T> {
		if(!this.typeSetCache.has(type)) {
			this.typeSetCache.set(type, new Set());
		}

		const container = this.typeSetCache.get(type)!;

		container.clear();

		for (const component of this.components) {
			if (component instanceof type) {
				container.add(component as T);
			}
		}

		return container;
	}

	private tagSetCache = new Map<string | number | symbol, Set<Actor | Behavior>>;

	private typeSetCache = new Map<new () => Actor | Behavior, Set<Actor | Behavior>>;

	private disposables: (() => void)[] = [];
}
