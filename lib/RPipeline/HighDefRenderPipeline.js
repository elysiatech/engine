import { RenderPipeline } from "./RenderPipeline";
import * as Three from "three";
import { BlendFunction, BloomEffect, ChromaticAberrationEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { N8AOPostPass } from "../WebGL/SSAO";
import { Vector2 } from "three";
import { noop } from "../Core/Utilities";
/**
 * A high definition render pipeline that uses pmndr's Postprocessing to render the scene.
 */
export class HighDefRenderPipeline extends RenderPipeline {
    get devicePixelRatio() { return this.#devicePixelRatio; }
    set devicePixelRatio(value) { this.#devicePixelRatio = value; this.renderer.setPixelRatio(value); }
    constructor(args = {}) {
        super();
        if (args.devicePixelRatio) {
            this.#devicePixelRatio = args.devicePixelRatio;
        }
        if (args.toneMapping) {
            if (args.toneMapping.blendFunction) {
                this.#tonemappingBlendFunction = args.toneMapping.blendFunction;
            }
            if (args.toneMapping.mode) {
                this.#tonemappingMode = args.toneMapping.mode;
            }
            if (args.toneMapping.resolution) {
                this.#tonemappingResolution = args.toneMapping.resolution;
            }
            if (args.toneMapping.whitePoint) {
                this.#tonemappingWhitePoint = args.toneMapping.whitePoint;
            }
            if (args.toneMapping.middleGrey) {
                this.#tonemappingMiddleGrey = args.toneMapping.middleGrey;
            }
            if (args.toneMapping.minLuminance) {
                this.#tonemappingMinLuminance = args.toneMapping.minLuminance;
            }
            if (args.toneMapping.averageLuminance) {
                this.#tonemappingAverageLuminance = args.toneMapping.averageLuminance;
            }
            if (args.toneMapping.adaptationRate) {
                this.#tonemappingAdaptationRate = args.toneMapping.adaptationRate;
            }
        }
        this.#createEffectChain = args.createEffectChain ?? noop;
        this.#useSSAO = !!args.ssao;
        if (args.ssao && typeof args.ssao === "object") {
            if (args.ssao.aoRadius) {
                this.#ssaoRadius = args.ssao.aoRadius;
            }
            if (args.ssao.distanceFalloff) {
                this.#ssaoDistanceFalloff = args.ssao.distanceFalloff;
            }
            if (args.ssao.intensity) {
                this.#ssaoIntensity = args.ssao.intensity;
            }
            if (args.ssao.color) {
                this.#ssaoColor = args.ssao.color;
            }
            if (args.ssao.halfResolution) {
                this.#ssaoHalfResolution = args.ssao.halfResolution;
            }
            if (args.ssao.qualityMode) {
                this.#ssaoQualityMode = args.ssao.qualityMode;
            }
        }
        this.#useBloom = !!args.bloom;
        if (args.bloom && typeof args.bloom === "object") {
            this.#bloomEffectOptions = args.bloom;
        }
        this.#useChromaticAberration = !!args.chromaticAberration;
        if (args.chromaticAberration && typeof args.chromaticAberration === "object") {
            this.#chromaticAberrationOptions = args.chromaticAberration;
        }
        this.#alpha = args.alpha ?? false;
        this.#shadows = args.shadows ?? true;
    }
    onCreate(scene, output) {
        this.scene = scene;
        this.output = output;
        const size = new Vector2();
        const camera = scene.getActiveCamera();
        if (!camera) {
            ELYSIA_LOGGER.error("Cannot build render pipeline: No active camera found in scene.");
            return;
        }
        this.renderer = new Three.WebGLRenderer({ canvas: output, alpha: this.#alpha });
        this.renderer.shadowMap.enabled = this.#shadows;
        this.renderer.shadowMap.type = Three.PCFSoftShadowMap;
        this.effectComposer = new EffectComposer(this.renderer, {
            frameBufferType: Three.HalfFloatType,
            depthBuffer: true,
            stencilBuffer: true,
            alpha: true,
        });
        this.renderer.setPixelRatio(this.#devicePixelRatio);
        this.effectComposer.setMainCamera(camera);
        this.effectComposer.addPass(new RenderPass(this.scene.object3d, camera));
        this.renderer.getSize(size);
        this.#createEffectChain(this.effectComposer, scene, camera);
        if (this.#useChromaticAberration) {
            this.#chromaticAberrationEffect = new ChromaticAberrationEffect(this.#chromaticAberrationOptions);
            this.effectComposer.addPass(new EffectPass(camera, this.#chromaticAberrationEffect));
        }
        if (this.#useBloom) {
            this.#bloomEffect = new BloomEffect(this.#bloomEffectOptions);
            this.effectComposer.addPass(new EffectPass(camera, this.#bloomEffect));
        }
        if (this.#useSSAO) {
            this.#ssaoPass = new N8AOPostPass(scene.object3d, camera, size.x, size.y);
            if (this.#ssaoRadius)
                this.#ssaoPass.configuration.aoRadius = this.#ssaoRadius;
            if (this.#ssaoDistanceFalloff)
                this.#ssaoPass.configuration.distanceFalloff = this.#ssaoDistanceFalloff;
            if (this.#ssaoIntensity)
                this.#ssaoPass.configuration.intensity = this.#ssaoIntensity;
            if (this.#ssaoColor)
                this.#ssaoPass.configuration.color = this.#ssaoColor;
            // @ts-ignore
            this.#ssaoPass.setQualityMode(this.#ssaoQualityMode);
            this.#ssaoPass.configuration.halfRes = this.#ssaoHalfResolution;
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
        });
        this.effectComposer.addPass(new EffectPass(camera, this.#tonemappingEffect));
    }
    onCameraChange(camera) { this.effectComposer.setMainCamera(camera); }
    onResize(width, height) { this.effectComposer.setSize(width, height, false); }
    onRender() {
        this.effectComposer.render();
    }
    getRenderer() { return this.renderer; }
    renderer;
    effectComposer;
    scene;
    output;
    #alpha;
    #shadows;
    #smaaEffect;
    #smaaPreset = SMAAPreset.ULTRA;
    #devicePixelRatio = window.devicePixelRatio ?? 1;
    #createEffectChain = noop;
    #tonemappingEffect;
    #tonemappingBlendFunction = BlendFunction.NORMAL;
    #tonemappingMode = ToneMappingMode.ACES_FILMIC;
    #tonemappingResolution = 256;
    #tonemappingWhitePoint = 4.0;
    #tonemappingMiddleGrey = 0.6;
    #tonemappingMinLuminance = 0.01;
    #tonemappingAverageLuminance = 1.0;
    #tonemappingAdaptationRate = 1.0;
    #useSSAO = false;
    #ssaoPass;
    #ssaoRadius;
    #ssaoDistanceFalloff;
    #ssaoIntensity;
    #ssaoColor;
    #ssaoQualityMode = "Ultra";
    #ssaoHalfResolution = true;
    #useBloom = false;
    #bloomEffect;
    #bloomEffectOptions;
    #useChromaticAberration = false;
    #chromaticAberrationEffect;
    #chromaticAberrationOptions;
}
