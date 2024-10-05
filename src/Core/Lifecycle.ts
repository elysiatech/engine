import { Actor } from "../Scene/Actor";
import { Scene } from "../Scene/Scene";
import * as Three from "three";

export interface Destroyable {
	destructor(): void;
}

export interface ActorLifecycle
{
	/**
	 * Called once when the actor is created.
	 */
	onCreate(): void;

	/**
	 * Called when the actor is enabled.
	 */
	onEnable(): void;

	/**
	 * Called once before onUpdate() when the actor is started.
	 */
	onStart(): void;

	/**
	 * Called when the actor enters the scene.
	 */
	onEnterScene(): void;

	onBeforePhysicsUpdate?(delta: number, elapsed: number): void;

	onPhysicsUpdate?(delta: number, elapsed: number): void;

	/**
	 * Called every frame when the actor is updated.
	 * @param delta The time in seconds since the last frame.
	 * @param elapsed The time in seconds since the application was instantiated.
	 */
	onUpdate(delta: number, elapsed: number): void;

	/**
	 * Called when the actor is disabled.
	 */
	onDisable(): void;

	/**
	 * Called when the actor leaves the scene.
	 */
	onLeaveScene(): void;

	/**
	 * Called when the actor's destructor is called.
	 */
	onDestroy?(): void;

	/**
	 * Called when the actor is reparented.
	 * @param parent
	 */
	onReparent?(parent: Actor | null): void;
}

export interface SceneLifecycle
{
	/**
	 * Called when the scene is loaded.
	 */
	onLoad(): void | Promise<void>;

	/**
	 * Called when the scene is started.
	 */
	onStart(): void;

	/**
	 * Called every frame when the scene is updated.
	 * @param delta The time in seconds since the last frame.
	 * @param elapsed The time in seconds since the application was instantiated.
	 */
	onUpdate(delta: number, elapsed: number): void;

	/**
	 * Called when the scene is stopped.
	 */
	onEnd(): void;
}

export interface RenderPipelineLifecycle
{
	onCreate(scene: Scene, output: HTMLCanvasElement): void;

	onCameraChange(camera: Three.Camera): void;

	onResize(width: number, height: number): void;

	onRender(scene: Scene, camera: Three.Camera): void;
}
