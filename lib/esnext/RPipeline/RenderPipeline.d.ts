import { Destroyable, RenderPipelineLifecycle } from "../Core/Lifecycle.ts";
import { Scene } from "../Scene/Scene.ts";
import * as Three from "three";
/**
 * A render pipeline is a class that is responsible for rendering a scene.
 * It implements a render function that is called every frame.
 */
export declare abstract class RenderPipeline implements RenderPipelineLifecycle, Destroyable {
    /**
     * Called when the pipeline is created for a given scene.
     * It may be called multiple times if the scene is changed.
     */
    abstract onCreate(scene: Scene, output: HTMLCanvasElement): void;
    /**
     * Called when the active camera is changed.
     */
    onCameraChange(camera: Three.Camera): void;
    /**
     * Retrieves the renderer used by the pipeline.
     */
    abstract getRenderer(): Three.WebGLRenderer;
    /**
     * Called when the canvas is resized.
     */
    onResize(width: number, height: number): void;
    /**
     * Called every frame to render the scene.
     */
    abstract onRender(scene: Scene, camera: Three.Camera): void;
    destructor(): void;
}
