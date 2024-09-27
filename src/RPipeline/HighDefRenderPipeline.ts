import { RenderPipeline } from "./RenderPipeline";
import { Scene } from "../Scene/Scene";
import * as Three from "three";
import {
	BlendFunction,
	BloomEffect,
	EffectComposer,
	EffectPass,
	RenderPass,
	SMAAEffect,
	SMAAPreset,
	ToneMappingEffect,
	ToneMappingMode
} from "postprocessing";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { N8AOPostPass } from "../WebGL/SSAO";
import { WebGLRenderer } from "three";

type HighDefRenderPipelineConstructorArguments = {
	alpha?: boolean;
	devicePixelRatio?: number;
	smaaPreset?: SMAAPreset;
	toneMapping?: {
		blendFunction?: BlendFunction
		adaptive?: boolean
		mode?: ToneMappingMode
		resolution?: number
		whitePoint?: number
		middleGrey?: number
		minLuminance?: number
		averageLuminance?: number
		adaptationRate?: number
	}
};

/**
 * A high definition render pipeline that uses pmndr's Postprocesing to render the scene.
 */
export class HighDefRenderPipeline extends RenderPipeline
{
	get devicePixelRatio() { return this.#devicePixelRatio; }
	set devicePixelRatio(value) { this.#devicePixelRatio = value; this.renderer.setPixelRatio(value); }

	get smaaPreset() { return this.#smaaPreset; }
	set smaaPreset(value) { this.#smaaPreset = value; this.#smaaEffect?.applyPreset(value); }

	constructor(args: HighDefRenderPipelineConstructorArguments = {})
	{
		super();

		if(args.devicePixelRatio) { this.#devicePixelRatio = args.devicePixelRatio; }

		if(args.toneMapping)
		{
			if(args.toneMapping.blendFunction) { this.#tonemappingBlendFunction = args.toneMapping.blendFunction; }
			if(args.toneMapping.mode) { this.#tonemappingMode = args.toneMapping.mode; }
			if(args.toneMapping.resolution) { this.#tonemappingResolution = args.toneMapping.resolution; }
			if(args.toneMapping.whitePoint) { this.#tonemappingWhitePoint = args.toneMapping.whitePoint; }
			if(args.toneMapping.middleGrey) { this.#tonemappingMiddleGrey = args.toneMapping.middleGrey; }
			if(args.toneMapping.minLuminance) { this.#tonemappingMinLuminance = args.toneMapping.minLuminance; }
			if(args.toneMapping.averageLuminance) { this.#tonemappingAverageLuminance = args.toneMapping.averageLuminance; }
			if(args.toneMapping.adaptationRate) { this.#tonemappingAdaptationRate = args.toneMapping.adaptationRate; }
		}

		this.#alpha = args.alpha ?? false;
	}

	onCreate(scene: Scene, output: HTMLCanvasElement)
	{
		this.scene = scene;
		this.output = output;

		const camera = scene.getActiveCamera();

		if (!camera)
		{
			ELYSIA_LOGGER.error("Cannot build render pipeline: No active camera found in scene.");
			return;
		}

		this.renderer = new Three.WebGLRenderer({ canvas: output, alpha: this.#alpha });

		this.renderer.shadowMap.enabled = true;

		this.effectComposer = new EffectComposer(
			this.renderer,
			{
				frameBufferType: Three.HalfFloatType,
				depthBuffer: true,
				stencilBuffer: true,
				alpha: true,
			}
		);

		this.renderer.setPixelRatio(this.#devicePixelRatio);

		this.effectComposer.setMainCamera(camera);

		this.effectComposer.addPass(new RenderPass(this.scene.object3d, camera));

		this.#smaaEffect = new SMAAEffect({ preset: this.#smaaPreset });

		this.effectComposer.addPass(new EffectPass(camera, this.#smaaEffect));

		this.#tonemappingEffect = new ToneMappingEffect({
			blendFunction: this.#tonemappingBlendFunction,
			whitePoint: this.#tonemappingWhitePoint,
			middleGrey: this.#tonemappingMiddleGrey,
			minLuminance: this.#tonemappingMinLuminance,
			averageLuminance: this.#tonemappingAverageLuminance,
			mode: this.#tonemappingMode,
			resolution: this.#tonemappingResolution,
			adaptationRate: this.#tonemappingAdaptationRate
		})

		this.effectComposer.addPass(new EffectPass(camera, this.#tonemappingEffect));
	}

	onCameraChange(camera: Three.Camera) { this.effectComposer.setMainCamera(camera); }

	onResize(width: number, height: number) { this.effectComposer.setSize(width, height); }

	onRender() { this.effectComposer.render(); }

	getRenderer(): WebGLRenderer { return this.renderer; }

	private renderer!: Three.WebGLRenderer;
	private effectComposer!: EffectComposer;
	private scene?: Scene;
	private output?: HTMLCanvasElement;

	#alpha: boolean;
	#smaaEffect?: SMAAEffect;
	#smaaPreset = SMAAPreset.ULTRA;
	#devicePixelRatio: number = window.devicePixelRatio ?? 1;
	#tonemappingEffect?: ToneMappingEffect;
	#tonemappingBlendFunction: BlendFunction = BlendFunction.NORMAL;
	#tonemappingMode: ToneMappingMode = ToneMappingMode.ACES_FILMIC;
	#tonemappingResolution: number = 256;
	#tonemappingWhitePoint: number = 4.0;
	#tonemappingMiddleGrey: number = 0.6;
	#tonemappingMinLuminance: number = 0.01;
	#tonemappingAverageLuminance: number = 1.0;
	#tonemappingAdaptationRate: number = 1.0;
}