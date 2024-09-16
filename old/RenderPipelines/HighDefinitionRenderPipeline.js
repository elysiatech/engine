import { EffectComposer, } from "postprocessing";
import * as Three from "three";
import { RenderPipeline } from "./RenderPipeline";
export class HighDefinitionRenderPipeline extends RenderPipeline {
    constructor(args) {
        super();
        this.renderer = new Three.WebGLRenderer({
            canvas: args.canvas,
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false,
        });
        this.effectComposer = new EffectComposer(this.renderer, {
            frameBufferType: Three.HalfFloatType,
            multisampling: args.multisampling ?? 0,
        });
        this.effects = args.effects;
        this.renderer.setPixelRatio(args.devicePixelRatio ?? window.devicePixelRatio);
    }
    getRenderer() {
        return this.renderer;
    }
    onLoadScene(game, scene) {
        this.scene = scene;
        for (const p of this.effects(scene, this.effectComposer)) {
            this.effectComposer.addPass(p);
        }
    }
    onResize(bounds) {
        this.effectComposer.setSize(bounds.width, bounds.height, false);
    }
    render() {
        const camera = this.scene.getActiveCamera();
        const scene = this.scene.root.object3d;
        this.effectComposer.setMainCamera(camera.object3d);
        this.effectComposer.setMainScene(scene);
        this.effectComposer.render();
    }
    effectComposer;
    renderer;
    scene = null;
    effects;
}
