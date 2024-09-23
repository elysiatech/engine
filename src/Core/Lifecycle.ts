import { Actor } from "../Scene/Actor";

export interface Destroyable {
	destructor(): void;
}

export interface ActorLifecycle
{
	onCreate?(): void;

	onEnable?(): void;

	onStart?(): void;

	onUpdate?(delta: number, elapsed: number): void;

	onDisable?(): void;

	onReparent?(parent: Actor | null): void;
}

export interface SceneLifecycle
{
	onLoad?(): void | Promise<void>;

	onStart?(): void;

	onUpdate?(delta: number, elapsed: number): void;

	onDestroy?(): void;
}
