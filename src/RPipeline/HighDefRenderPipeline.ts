import { RenderPipeline } from "./RenderPipeline";
import { Scene } from "../Scene/Scene";
import * as Three from "three";
import {
	BlendFunction,
	BloomEffect, BloomEffectOptions, ChromaticAberrationEffect,
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
import { Vector2, WebGLRenderer } from "three";
import { noop } from "../Core/Utilities";

type HighDefRenderPipelineConstructorArguments = {
	alpha?: boolean;
	shadows?: boolean;
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
	ssao?: boolean | {
		aoRadius?: number
		distanceFalloff?: number
		intensity?: number
		color?: Three.Color
	},
	bloom?: boolean | BloomEffectOptions,
	chromaticAberration?: boolean | {
		blendFunction?: BlendFunction,
		offset?: Vector2,
		radialModulation: boolean,
		modulationOffset: number
	},
	createEffectChain?(effectComposer: EffectComposer, scene: Scene, camera: Three.Camera): void;
};

/**
 * A high definition render pipeline that uses pmndr's Postprocessing to render the scene.
 */
export class HighDefRenderPipeline extends RenderPipeline
{
	get devicePixelRatio() { return this.#devicePixelRatio; }
	set devicePixelRatio(value) { this.#devicePixelRatio = value; this.renderer.setPixelRatio(value); }

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

		this.#createEffectChain = args.createEffectChain ?? noop;

		this.#useSSAO = !!args.ssao;

		if(args.ssao && typeof args.ssao === "object")
		{
			if(args.ssao.aoRadius) { this.#ssaoRadius = args.ssao.aoRadius; }
			if(args.ssao.distanceFalloff) { this.#ssaoDistanceFalloff = args.ssao.distanceFalloff; }
			if(args.ssao.intensity) { this.#ssaoIntensity = args.ssao.intensity; }
			if(args.ssao.color) { this.#ssaoColor = args.ssao.color; }
		}

		this.#useBloom = !!args.bloom;

		if(args.bloom && typeof args.bloom === "object")
		{
			this.#bloomEffectOptions = args.bloom;
		}

		this.#useChromaticAberration = !!args.chromaticAberration;

		if(args.chromaticAberration && typeof args.chromaticAberration === "object")
		{
			this.#chromaticAberrationOptions = args.chromaticAberration;
		}

		this.#alpha = args.alpha ?? false;
		this.#shadows = args.shadows ?? true;
	}

	onCreate(scene: Scene, output: HTMLCanvasElement)
	{
		this.scene = scene;
		this.output = output;
		const size = new Vector2()

		const camera = scene.getActiveCamera();

		if (!camera)
		{
			ELYSIA_LOGGER.error("Cannot build render pipeline: No active camera found in scene.");
			return;
		}

		this.renderer = new Three.WebGLRenderer({ canvas: output, alpha: this.#alpha });

		this.renderer.shadowMap.enabled = this.#shadows;

		this.renderer.shadowMap.type = Three.PCFSoftShadowMap

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

		this.renderer.getSize(size)

		this.#createEffectChain(this.effectComposer, scene, camera);

		if(this.#useChromaticAberration)
		{
			this.#chromaticAberrationEffect = new ChromaticAberrationEffect(this.#chromaticAberrationOptions);
			this.effectComposer.addPass(new EffectPass(camera, this.#chromaticAberrationEffect));
		}

		if(this.#useBloom)
		{

			this.#bloomEffect = new BloomEffect(this.#bloomEffectOptions);
			this.effectComposer.addPass(new EffectPass(camera, this.#bloomEffect));
		}

		if(this.#useSSAO)
		{
			this.#ssaoPass = new N8AOPostPass(scene.object3d, camera, size.x, size.y);
			if(this.#ssaoRadius) this.#ssaoPass.configuration.aoRadius = this.#ssaoRadius;
			if(this.#ssaoDistanceFalloff) this.#ssaoPass.configuration.distanceFalloff = this.#ssaoDistanceFalloff;
			if(this.#ssaoIntensity) this.#ssaoPass.configuration.intensity = this.#ssaoIntensity;
			if(this.#ssaoColor) this.#ssaoPass.configuration.color = this.#ssaoColor;
			this.effectComposer.addPass(this.#ssaoPass);
		}

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
	#shadows: boolean;

	#smaaEffect?: SMAAEffect;
	#smaaPreset = SMAAPreset.ULTRA;

	#devicePixelRatio: number = window.devicePixelRatio ?? 1;

	#createEffectChain: (effectComposer: EffectComposer, scene: Scene, camera: Three.Camera) => void = noop;

	#tonemappingEffect?: ToneMappingEffect;
	#tonemappingBlendFunction: BlendFunction = BlendFunction.NORMAL;
	#tonemappingMode: ToneMappingMode = ToneMappingMode.ACES_FILMIC;
	#tonemappingResolution: number = 256;
	#tonemappingWhitePoint: number = 4.0;
	#tonemappingMiddleGrey: number = 0.6;
	#tonemappingMinLuminance: number = 0.01;
	#tonemappingAverageLuminance: number = 1.0;
	#tonemappingAdaptationRate: number = 1.0;

	#useSSAO: boolean = false;
	#ssaoPass?: N8AOPostPass;
	#ssaoRadius?: number;
	#ssaoDistanceFalloff?: number;
	#ssaoIntensity?: number;
	#ssaoColor?: Three.Color;

	#useBloom: boolean = false;
	#bloomEffect?: BloomEffect;
	#bloomEffectOptions?: BloomEffectOptions;

	#useChromaticAberration: boolean = false;
	#chromaticAberrationEffect?: ChromaticAberrationEffect;
	#chromaticAberrationOptions?: any;
}