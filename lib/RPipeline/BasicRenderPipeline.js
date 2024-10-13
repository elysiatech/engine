import { RenderPipeline } from "./RenderPipeline";
import * as Three from "three";
/**
 * A basic render pipeline that uses Three.js to render the scene with the default WebGLRenderer.
 */
export class BasicRenderPipeline extends RenderPipeline {
    constructor(args = {}) {
        super();
        this.args = args;
    }
    onCreate(scene, output) {
        this.renderer = new Three.WebGLRenderer({ ...this.args, canvas: output });
        this.renderer.shadowMap.enabled = this.args.shadows ?? true;
        if (this.args.devicePixelRatio) {
            this.renderer.setPixelRatio(this.args.devicePixelRatio);
        }
        else {
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
        if (this.args.toneMapping) {
            this.renderer.toneMapping = this.args.toneMapping ?? Three.ACESFilmicToneMapping;
        }
        if (this.args.toneMappingExposure) {
            this.renderer.toneMappingExposure = this.args.toneMappingExposure;
        }
    }
    onResize(width, height) {
        console.log("Resizing " + width + " " + height);
        this.renderer?.setSize(width, height, false);
        this.renderer?.setPixelRatio(window.devicePixelRatio);
    }
    onRender(scene, camera) { this.renderer.render(scene.object3d, camera); }
    getRenderer() { return this.renderer; }
    renderer;
    args;
}
