import {
	EffectComposer,
	type EffectPass,
	type RenderPass,
} from "postprocessing";
import * as Three from "three";
import type { Game } from "../game";
import { RenderPipeline } from "../render_pipeline";
import type { Scene } from "../scene";

type HighDefinitionRenderPipelineArgs = {
	canvas?: HTMLCanvasElement;
	effects(
		scene: Scene,
		composer: EffectComposer,
	): Array<RenderPass | EffectPass>;
	devicePixelRatio?: number;
	multisampling?: number;
};

export class HighDefinitionRenderPipeline extends RenderPipeline {
	constructor(args: HighDefinitionRenderPipelineArgs) {
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

		this.renderer.setPixelRatio(
			args.devicePixelRatio ?? window.devicePixelRatio,
		);
	}

	getRenderer(): Three.WebGLRenderer {
		return this.renderer;
	}

	onLoadScene(game: Game, scene: Scene): void {
		this.scene = scene;

		for (const p of this.effects(scene, this.effectComposer)) {
			this.effectComposer.addPass(p);
		}
	}

	onResize(bounds: DOMRect): void {
		this.effectComposer.setSize(bounds.width, bounds.height, false);
	}

	render() {
		const camera = this.scene!.getActiveCamera()!;
		const scene = this.scene!.root.object3d;

		this.effectComposer.setMainCamera(camera.object3d);
		this.effectComposer.setMainScene(scene);

		this.effectComposer.render();
	}

	public effectComposer: EffectComposer;

	private renderer: Three.WebGLRenderer;

	private scene: Scene | null = null;

	private effects: HighDefinitionRenderPipelineArgs["effects"];
}
