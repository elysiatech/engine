import { Destroyable } from "../Core/Lifecycle";
import { Scene } from "../Scene/Scene";
import * as Three from "three";

/**
 * A render pipeline is a class that is responsible for rendering a scene.
 * It implements a render function that is called every frame.
 */
export abstract class RenderPipeline implements Destroyable {
	/**
	 * Called when the pipeline is created for a given scene.
	 * It may be called multiple times if the scene is changed.
	 */
	abstract onCreate(scene: Scene, output: HTMLCanvasElement): void

	/**
	 * Called when the active camera is changed.
	 */
	onCameraChange(camera: Three.Camera) { }

	/**
	 * Retrieves the renderer used by the pipeline.
	 */
	abstract getRenderer(): Three.WebGLRenderer;

	/**
	 * Called when the canvas is resized.
	 */
	onResize(width: number, height: number) { }

	/**
	 * Called every frame to render the scene.
	 */
	abstract onRender(scene: Scene, camera: Three.Camera): void;

	/**
	 * Called when the pipeline is destroyed. Used to clean up resources.
	 */
	destructor() { }
}