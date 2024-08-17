import * as Three from "three";
import { isActor, isBehavior } from "./asserts";
import type { Behavior } from "./behavior";
import { destroy } from "./destroy";
import type { Scene } from "./scene";

export class Actor<T extends Three.Object3D = Three.Object3D> {
	get isActor() {
		return true;
	}

	public id?: string | symbol;

	public tags = new Set<string | symbol>();

	public object3d: T;

	public scene: Scene | null = null;

	public parent: Actor | null = null;

	get position() {
		return this.object3d.position;
	}

	get rotation() {
		return this.object3d.rotation;
	}

	get scale() {
		return this.object3d.scale;
	}

	get quaternion() {
		return this.object3d.quaternion;
	}

	get matrix() {
		return this.object3d.matrix;
	}

	get visible() {
		return this.object3d.visible;
	}

	set visible(value: boolean) {
		this.object3d.visible = value;
	}

	public readonly children: Set<Actor | Behavior> = new Set();

	public initialized = false;

	public spawned = false;

	public destroyed = false;

	constructor() {
		this.object3d = new Three.Object3D() as T;
		this.object3d.userData.owner = this;
	}

	addChild<T extends Actor | Behavior>(child: T): this {
		if (this.destroyed) return this;

		if (isActor(child.parent)) {
			child.parent.removeChild(child);
		}

		this.children.add(child);

		child.parent = this;
		child.scene = this.scene;

		if (isActor(child)) {
			this.object3d.add(child.object3d);

			if (child.id) {
				this.scene?.gameObjectsById.set(child.id, child);
			}

			if (child.tags) {
				for (const tag of child.tags) {
					if (!this.scene?.gameObjectsByTag.has(tag)) {
						this.scene?.gameObjectsByTag.set(tag, new Set());
					}
					this.scene?.gameObjectsByTag.get(tag)?.add(child);
				}
			}
		}

		if (isBehavior(child)) {
			if (child.id) {
				this.scene?.behaviorsById.set(child.id, child);
			}

			if (child.tags) {
				for (const tag of child.tags) {
					if (!this.scene?.behaviorsByTag.has(tag)) {
						this.scene?.behaviorsByTag.set(tag, new Set());
					}
					this.scene?.behaviorsByTag.get(tag)?.add(child);
				}
			}
		}

		if (this.initialized) {
			child.create();
		}

		if (this.spawned) {
			child.spawn();
		}

		return this;
	}

	removeChild<T extends Actor | Behavior>(child: T): T {
		if (this.destroyed) return child;

		child.parent = null;

		this.children.delete(child);

		if (isActor(child)) {
			this.object3d.remove(child.object3d);

			if (child.id) {
				this.scene?.gameObjectsById.delete(child.id);
			}

			if (child.tags) {
				for (const tag of child.tags) {
					this.scene?.gameObjectsByTag.get(tag)?.delete(child);
				}
			}
		}

		return child;
	}

	addTag(tag: string | symbol): this {
		this.tags.add(tag);
		if (!this.scene?.gameObjectsByTag.has(tag)) {
			this.scene?.gameObjectsByTag.set(tag, new Set());
		}
		this.scene?.gameObjectsByTag.get(tag)!.add(this);
		return this;
	}

	removeTag(tag: string | symbol): this {
		this.tags.delete(tag);
		this.scene?.gameObjectsByTag.get(tag)?.delete(this);
		return this;
	}

	create() {
		if (this.initialized || this.destroyed) return;

		this.object3d.userData.owner = this;

		this.onCreate();

		this.initialized = true;

		for (const child of this.children) {
			child.scene = this.scene;
			child.create();
		}
	}

	spawn() {
		if (this.spawned || this.destroyed) return;
		this.onSpawn();
		this.spawned = true;
		this.parent?.object3d.add(this.object3d);
		for (const child of this.children) {
			child.spawn();
		}
	}

	update(frametime: number, elapsedtime: number) {
		if (!this.spawned || this.destroyed) return;
		this.onUpdate(frametime, elapsedtime);
		for (const child of this.children) {
			child.update(frametime, elapsedtime);
		}
	}

	despawn() {
		if (!this.spawned || this.destroyed) return;
		this.onDespawn();
		this.parent?.object3d.remove(this.object3d);
		for (const child of this.children) {
			child.despawn();
		}
	}

	destroy() {
		if (this.destroyed) return;
		this.destructor();
		this.destroyed = true;
		destroy(this.object3d);
		for (const child of this.children) {
			child.despawn();
		}
	}

	resize(bounds: DOMRect) {
		if (!this.initialized || this.destroyed) return;
		this.onResize(bounds);
		for (const child of this.children) {
			child.resize(bounds);
		}
	}

	onCreate(): void {}
	onSpawn(): void {}
	onUpdate(frametime: number, elapsedtime: number): void {}
	onDespawn(): void {}
	onResize(bounds: DOMRect): void {}
	destructor(): void {}

	getChildrenByTag(tag: string | symbol): (Actor | Behavior)[] {
		const children: (Actor | Behavior)[] = [];
		for (const child of this.children) {
			if (child.tags.has(tag)) {
				children.push(child);
			}
		}
		return children;
	}

	getChildById(id: string | symbol): Actor | Behavior | null {
		for (const child of this.children) {
			if (child.id === id) {
				return child;
			}
		}
		return null;
	}

	getBehaviorsByType<T extends string | symbol>(type: new () => T): T | null {
		for (const child of this.children) {
			if (isBehavior(child) && child instanceof type) {
				return child;
			}
		}
		return null;
	}

	getBehaviorsByTag(tag: string | symbol): Behavior[] {
		const behaviors: Behavior[] = [];
		for (const child of this.children) {
			if (isBehavior(child) && child.tags.has(tag)) {
				behaviors.push(child);
			}
		}
		return behaviors;
	}

	getBehaviorById(id: string): Behavior | null {
		for (const child of this.children) {
			if (isBehavior(child) && child.id === id) {
				return child;
			}
		}
		return null;
	}

	getGameObjectByType<T extends Actor>(type: new () => T): T | null {
		for (const child of this.children) {
			if (isActor(child) && child instanceof type) {
				return child;
			}
		}
		return null;
	}

	getGameObjectById(id: string): Actor | null {
		for (const child of this.children) {
			if (isActor(child) && child.id === id) {
				return child;
			}
		}
		return null;
	}

	getGameObjectsByTag(tag: string): Actor[] {
		const gameObjects: Actor[] = [];
		for (const child of this.children) {
			if (isActor(child) && child.tags.has(tag)) {
				gameObjects.push(child);
			}
		}
		return gameObjects;
	}

	*childs(): IterableIterator<Actor | Behavior> {
		for (const child of this.children) {
			yield child;
		}
	}
}
