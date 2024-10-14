import { Actor } from "../Scene/Actor.ts";
import { Scene } from "../Scene/Scene.ts";
import * as Three from "three";
export interface Destroyable {
    destructor(): void;
}
export interface ActorLifecycle {
    /**
     * Called once when the actor is created.
     * This is the first method called in the actor's lifecycle and will only be called once.
     * The actor's App, Scene, and Parent reference will be defined by the time this is called.
     */
    onCreate(): void;
    /**
     * Called when the actor is enabled. This occurs when the actor is added to the scene
     * and when the actor is enabled after being disabled. This may be called multiple times.
     */
    onEnable(): void;
    /**
     * Called before onUpdate() when the actor is started. This will only be called once.
     */
    onStart(): void;
    /**
     * Called when the actor enters the scene. It can be called multiple times if the actor is
     * removed from the scene and added again.
     */
    onEnterScene(): void;
    /**
     * Called before physics simulation tick, after collider positions have been updated in the physics world.
     * @param delta
     * @param elapsed
     */
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
    /**
     * Called every frame when the actor is updated. This is the last step before rendering.
     * @param delta The time in seconds since the last frame.
     * @param elapsed The time in seconds since the application was instantiated.
     */
    onUpdate(delta: number, elapsed: number): void;
    /**
     * Called when the actor is disabled. This occurs when the actor leaves the scene, or when
     * actor.disable() is called and may be called multiple times.
     */
    onDisable(): void;
    /**
     * Called when the actor leaves the scene. It can be called multiple times if the actor is
     * removed from the scene and added again.
     */
    onLeaveScene(): void;
    /**
     * Called when the actor's destructor is called.
     */
    onDestroy(): void;
    /**
     * Called when the actor is reparented.
     * @param parent
     */
    onReparent(parent: Actor | null): void;
}
export interface SceneLifecycle {
    /**
     * Called when the scene is loaded. This is the first method called in the scene's lifecycle.
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
     * Called when the scene is stopped. Will be called when the scene is removed from the application or another
     * scene is loaded.
     */
    onEnd(): void;
}
export interface RenderPipelineLifecycle {
    /**
     * Called when the render pipeline is created, usually during application initialization.
     * @param scene
     * @param output
     */
    onCreate(scene: Scene, output: HTMLCanvasElement): void;
    /**
     * Called when an ActiveCameraTag is added or removed from an actor. The returned camera
     * is usually most recently added camera with the ActiveCameraTag.
     * @param camera
     */
    onCameraChange(camera: Three.Camera): void;
    /**
     * Called when the window is resized.
     * @param width
     * @param height
     */
    onResize(width: number, height: number): void;
    /**
     * Called when the scene is rendered.
     * @param scene
     * @param camera
     */
    onRender(scene: Scene, camera: Three.Camera): void;
    /**
     * Called when the container is resized.
     * @param width
     * @param height
     */
    onResize(width: number, height: number): void;
}
