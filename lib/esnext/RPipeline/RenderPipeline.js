import { bound } from "../Core/Utilities.js";
/**
 * A render pipeline is a class that is responsible for rendering a s_Scene.
 * It implements a render function that is called every frame.
 */
export class RenderPipeline {
    /**
     * Called when the active camera is changed.
     */
    @bound
    onCameraChange(camera) { }
    /**
     * Called when the canvas is resized.
     */
    @bound
    onResize(width, height) { }
    destructor() { }
}
