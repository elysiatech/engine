import type { Application } from "../Core/Application";
import type { Actor } from "./Actor"
import type { Scene } from "./Scene";

export class Behavior {

	public get isBehavior() {
		return true;
	}

	public id?: string | symbol | number;

	public tags = new Set<string | symbol | number>();

	public parent: Actor | null = null;

	public scene: Scene | null = null;

	public app: Application | null = null;

	public initialized = false;

	public spawned = false;

	public destroyed = false;

	create() {
		if (this.initialized || this.destroyed || !this.scene || !this.scene.app) return;
		this.onCreate();
		this.initialized = true;
	}

	spawn() {
		if (!this.initialized || this.spawned || this.destroyed) return;
		this.onSpawn();
		this.spawned = true;
	}

	update(frametime: number, elapsed: number) {
		if (!this.initialized || !this.spawned || this.destroyed) return;
		this.onUpdate(frametime, elapsed);
	}

	despawn() {
		if (!this.spawned || this.destroyed) return;
		this.onDespawn();
	}

	destroy() {
		if (this.destroyed) return;
		this.destructor();
	}

	resize(bounds: DOMRect) {
		if (!this.initialized || this.destroyed) return;
		this.onResize(bounds);
	}

	dispose(...callbacks: (() => void)[]) {
		this.disposables.push(...callbacks);
	}

	onCreate(): void {}

	onSpawn(): void {}

	onUpdate(frametime: number, elapsedtime: number): void {}

	onDespawn(): void {}

	onResize(bounds: DOMRect): void {}

	destructor(): void {
		this.disposables.forEach((fn) => fn());
		this.disposables = [];
		this.destroyed = true;
	}

	private disposables: (() => void)[] = [];
}
