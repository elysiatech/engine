import { RenderPipeline } from "./RenderPipeline";
import { Scene } from "../Scene/Scene";
import * as Three from "three";

type BasicRenderPipelineArguments = Three.WebGLRendererParameters & {
	toneMapping?: Three.ToneMapping;
	toneMappingExposure?: number;
	devicePixelRatio?: number;
};

/**
 * A basic render pipeline that uses Three.js to render the scene with the default WebGLRenderer.
 */
export class BasicRenderPipeline extends RenderPipeline
{
	constructor(args: BasicRenderPipelineArguments = {})
	{
		super();
		this.args = args;
	}

	onCreate(scene: Scene, output: HTMLCanvasElement) {
		this.renderer = new Three.WebGLRenderer({ ...this.args, canvas: output });
		this.renderer.shadowMap.enabled = true;
		if (this.args.devicePixelRatio) { this.renderer.setPixelRatio(this.args.devicePixelRatio); }
		else { this.renderer.setPixelRatio(window.devicePixelRatio); }
		if (this.args.toneMapping) { this.renderer.toneMapping = this.args.toneMapping ?? Three.ACESFilmicToneMapping; }
		if (this.args.toneMappingExposure) { this.renderer.toneMappingExposure = this.args.toneMappingExposure; }
	}

	onResize(width: number, height: number) {
		this.renderer?.setSize(width, height);
	}

	onRender(scene: Scene, camera: Three.Camera) { this.renderer!.render(scene.object3d, camera); }

	getRenderer() { return this.renderer!; }

	private renderer?: Three.WebGLRenderer;
	private args: BasicRenderPipelineArguments;
}