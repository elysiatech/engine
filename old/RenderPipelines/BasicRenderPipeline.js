import * as Three from "three";
import { RenderPipeline } from "./RenderPipeline";
export class BasicRenderPipeline extends RenderPipeline {
    constructor(args) {
        super();
        this.renderer = new Three.WebGLRenderer(args);
        args.devicePixelRatio && this.renderer.setPixelRatio(args.devicePixelRatio);
        if (args.toneMapping) {
            this.renderer.toneMapping = args.toneMapping;
        }
        if (args.toneMappingExposure) {
            this.renderer.toneMappingExposure = args.toneMappingExposure;
        }
    }
    getRenderer() {
        return this.renderer;
    }
    onLoadScene(game, scene) {
        this.scene = scene;
    }
    onResize(bounds) {
        this.renderer.setSize(bounds.width, bounds.height, false);
    }
    render() {
        const camera = this.scene.getActiveCamera();
        this.renderer.render(this.scene.root.object3d, camera.object3d);
    }
    renderer;
    scene = null;
}
