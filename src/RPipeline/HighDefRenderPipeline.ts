import { RenderPipeline } from "./RenderPipeline";
import { Scene } from "../Scene/Scene";
import * as Three from "three";
import { EffectComposer } from "postprocessing";
import { ActiveCameraTag } from "../Core/Tags";

type HighDef = Three.WebGLRendererParameters & {
	toneMapping?: Three.ToneMapping;
	toneMappingExposure?: number;
	devicePixelRatio?: number;
	frameBufferType?: Three.TextureDataType;
	depthBuffer?: boolean;
	stencilBuffer?: boolean;
	alpha?: boolean;
	multisampling?: number;
};

export class HighDefRenderPipeline extends RenderPipeline
{
	constructor(args: HighDef)
	{
		super();

		this.renderer = new Three.WebGLRenderer();

		if (args.devicePixelRatio) { this.renderer.setPixelRatio(args.devicePixelRatio); }
		if (args.toneMapping) { this.renderer.toneMapping = args.toneMapping; }
		if (args.toneMappingExposure) { this.renderer.toneMappingExposure = args.toneMappingExposure; }

		this.effectComposer = new EffectComposer(
			this.renderer,
			{
				frameBufferType: args.frameBufferType ?? Three.HalfFloatType,
				depthBuffer: args.depthBuffer ?? true,
				stencilBuffer: args.stencilBuffer ?? true,
				alpha: args.alpha ?? true,
				multisampling: args.multisampling ?? 4,
			}
		);
	}

	onCreate(scene: Scene, output: HTMLCanvasElement)
	{
		this.scene = scene;
		this.output = output;
		const camera = scene.getByTag(ActiveCameraTag)[0];
		if (camera) { this.effectComposer.setMainCamera(camera.object3d as Three.Camera); }
	}

	onCameraChange(camera: Three.Camera) { this.effectComposer.setMainCamera(camera); }

	onResize(width: number, height: number) { this.effectComposer.setSize(width, height); }

	onRender(scene: Scene, camera: Three.Camera) { this.effectComposer.render(); }

	private renderer: Three.WebGLRenderer;
	private effectComposer: EffectComposer;
	private scene?: Scene;
	private output?: HTMLCanvasElement;
}