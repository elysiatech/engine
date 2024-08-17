import * as Three from "three";
import type { Game } from "../game";
import { RenderPipeline } from "../render_pipeline";
import type { Scene } from "../scene";

type BasicRenderPipelineArgs = Three.WebGLRendererParameters & {
	toneMapping?: Three.ToneMapping;
	toneMappingExposure?: number;
	devicePixelRatio?: number;
};

export class BasicRenderPipeline extends RenderPipeline {
	constructor(args: BasicRenderPipelineArgs) {
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

	getRenderer(): Three.WebGLRenderer {
		return this.renderer;
	}

	onLoadScene(game: Game, scene: Scene): void {
		this.scene = scene;
	}

	onResize(bounds: DOMRect): void {
		this.renderer.setSize(bounds.width, bounds.height, false);
	}

	render() {
		const camera = this.scene!.getActiveCamera()!;

		this.renderer.render(this.scene!.root.object3d, camera.object3d);
	}

	private renderer: Three.WebGLRenderer;

	private scene: Scene | null = null;
}
