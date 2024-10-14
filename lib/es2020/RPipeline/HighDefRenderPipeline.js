var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _HighDefRenderPipeline_alpha, _HighDefRenderPipeline_shadows, _HighDefRenderPipeline_smaaEffect, _HighDefRenderPipeline_smaaPreset, _HighDefRenderPipeline_devicePixelRatio, _HighDefRenderPipeline_createEffectChain, _HighDefRenderPipeline_tonemappingEffect, _HighDefRenderPipeline_tonemappingBlendFunction, _HighDefRenderPipeline_tonemappingMode, _HighDefRenderPipeline_tonemappingResolution, _HighDefRenderPipeline_tonemappingWhitePoint, _HighDefRenderPipeline_tonemappingMiddleGrey, _HighDefRenderPipeline_tonemappingMinLuminance, _HighDefRenderPipeline_tonemappingAverageLuminance, _HighDefRenderPipeline_tonemappingAdaptationRate, _HighDefRenderPipeline_useSSAO, _HighDefRenderPipeline_ssaoPass, _HighDefRenderPipeline_ssaoRadius, _HighDefRenderPipeline_ssaoDistanceFalloff, _HighDefRenderPipeline_ssaoIntensity, _HighDefRenderPipeline_ssaoColor, _HighDefRenderPipeline_ssaoQualityMode, _HighDefRenderPipeline_ssaoHalfResolution, _HighDefRenderPipeline_useBloom, _HighDefRenderPipeline_bloomEffect, _HighDefRenderPipeline_bloomEffectOptions, _HighDefRenderPipeline_useChromaticAberration, _HighDefRenderPipeline_chromaticAberrationEffect, _HighDefRenderPipeline_chromaticAberrationOptions;
import { RenderPipeline } from "./RenderPipeline.js";
import * as Three from "three";
import { BlendFunction, BloomEffect, ChromaticAberrationEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { ELYSIA_LOGGER } from "../Core/Logger.js";
// @ts-ignore
import { N8AOPostPass } from "../WebGL/SSAO.js";
import { Vector2 } from "three";
import { noop } from "../Core/Utilities.js";
/**
 * A high definition render pipeline that uses pmndr's Postprocessing to render the scene.
 */
export class HighDefRenderPipeline extends RenderPipeline {
    get devicePixelRatio() { return __classPrivateFieldGet(this, _HighDefRenderPipeline_devicePixelRatio, "f"); }
    set devicePixelRatio(value) { __classPrivateFieldSet(this, _HighDefRenderPipeline_devicePixelRatio, value, "f"); this.renderer.setPixelRatio(value); }
    constructor(args = {}) {
        super();
        Object.defineProperty(this, "renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "effectComposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "output", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _HighDefRenderPipeline_alpha.set(this, void 0);
        _HighDefRenderPipeline_shadows.set(this, void 0);
        _HighDefRenderPipeline_smaaEffect.set(this, void 0);
        _HighDefRenderPipeline_smaaPreset.set(this, SMAAPreset.ULTRA);
        _HighDefRenderPipeline_devicePixelRatio.set(this, window.devicePixelRatio ?? 1);
        _HighDefRenderPipeline_createEffectChain.set(this, noop);
        _HighDefRenderPipeline_tonemappingEffect.set(this, void 0);
        _HighDefRenderPipeline_tonemappingBlendFunction.set(this, BlendFunction.NORMAL);
        _HighDefRenderPipeline_tonemappingMode.set(this, ToneMappingMode.ACES_FILMIC);
        _HighDefRenderPipeline_tonemappingResolution.set(this, 256);
        _HighDefRenderPipeline_tonemappingWhitePoint.set(this, 4.0);
        _HighDefRenderPipeline_tonemappingMiddleGrey.set(this, 0.6);
        _HighDefRenderPipeline_tonemappingMinLuminance.set(this, 0.01);
        _HighDefRenderPipeline_tonemappingAverageLuminance.set(this, 1.0);
        _HighDefRenderPipeline_tonemappingAdaptationRate.set(this, 1.0);
        _HighDefRenderPipeline_useSSAO.set(this, false);
        _HighDefRenderPipeline_ssaoPass.set(this, void 0);
        _HighDefRenderPipeline_ssaoRadius.set(this, void 0);
        _HighDefRenderPipeline_ssaoDistanceFalloff.set(this, void 0);
        _HighDefRenderPipeline_ssaoIntensity.set(this, void 0);
        _HighDefRenderPipeline_ssaoColor.set(this, void 0);
        _HighDefRenderPipeline_ssaoQualityMode.set(this, "Ultra");
        _HighDefRenderPipeline_ssaoHalfResolution.set(this, true);
        _HighDefRenderPipeline_useBloom.set(this, false);
        _HighDefRenderPipeline_bloomEffect.set(this, void 0);
        _HighDefRenderPipeline_bloomEffectOptions.set(this, void 0);
        _HighDefRenderPipeline_useChromaticAberration.set(this, false);
        _HighDefRenderPipeline_chromaticAberrationEffect.set(this, void 0);
        _HighDefRenderPipeline_chromaticAberrationOptions.set(this, void 0);
        if (args.devicePixelRatio) {
            __classPrivateFieldSet(this, _HighDefRenderPipeline_devicePixelRatio, args.devicePixelRatio, "f");
        }
        if (args.toneMapping) {
            if (args.toneMapping.blendFunction) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_tonemappingBlendFunction, args.toneMapping.blendFunction, "f");
            }
            if (args.toneMapping.mode) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_tonemappingMode, args.toneMapping.mode, "f");
            }
            if (args.toneMapping.resolution) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_tonemappingResolution, args.toneMapping.resolution, "f");
            }
            if (args.toneMapping.whitePoint) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_tonemappingWhitePoint, args.toneMapping.whitePoint, "f");
            }
            if (args.toneMapping.middleGrey) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_tonemappingMiddleGrey, args.toneMapping.middleGrey, "f");
            }
            if (args.toneMapping.minLuminance) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_tonemappingMinLuminance, args.toneMapping.minLuminance, "f");
            }
            if (args.toneMapping.averageLuminance) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_tonemappingAverageLuminance, args.toneMapping.averageLuminance, "f");
            }
            if (args.toneMapping.adaptationRate) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_tonemappingAdaptationRate, args.toneMapping.adaptationRate, "f");
            }
        }
        __classPrivateFieldSet(this, _HighDefRenderPipeline_createEffectChain, args.createEffectChain ?? noop, "f");
        __classPrivateFieldSet(this, _HighDefRenderPipeline_useSSAO, !!args.ssao, "f");
        if (args.ssao && typeof args.ssao === "object") {
            if (args.ssao.aoRadius) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_ssaoRadius, args.ssao.aoRadius, "f");
            }
            if (args.ssao.distanceFalloff) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_ssaoDistanceFalloff, args.ssao.distanceFalloff, "f");
            }
            if (args.ssao.intensity) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_ssaoIntensity, args.ssao.intensity, "f");
            }
            if (args.ssao.color) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_ssaoColor, args.ssao.color, "f");
            }
            if (args.ssao.halfResolution) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_ssaoHalfResolution, args.ssao.halfResolution, "f");
            }
            if (args.ssao.qualityMode) {
                __classPrivateFieldSet(this, _HighDefRenderPipeline_ssaoQualityMode, args.ssao.qualityMode, "f");
            }
        }
        __classPrivateFieldSet(this, _HighDefRenderPipeline_useBloom, !!args.bloom, "f");
        if (args.bloom && typeof args.bloom === "object") {
            __classPrivateFieldSet(this, _HighDefRenderPipeline_bloomEffectOptions, args.bloom, "f");
        }
        __classPrivateFieldSet(this, _HighDefRenderPipeline_useChromaticAberration, !!args.chromaticAberration, "f");
        if (args.chromaticAberration && typeof args.chromaticAberration === "object") {
            __classPrivateFieldSet(this, _HighDefRenderPipeline_chromaticAberrationOptions, args.chromaticAberration, "f");
        }
        __classPrivateFieldSet(this, _HighDefRenderPipeline_alpha, args.alpha ?? false, "f");
        __classPrivateFieldSet(this, _HighDefRenderPipeline_shadows, args.shadows ?? true, "f");
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
        this.renderer = new Three.WebGLRenderer({ canvas: output, alpha: __classPrivateFieldGet(this, _HighDefRenderPipeline_alpha, "f") });
        this.renderer.shadowMap.enabled = __classPrivateFieldGet(this, _HighDefRenderPipeline_shadows, "f");
        this.renderer.shadowMap.type = Three.PCFSoftShadowMap;
        this.effectComposer = new EffectComposer(this.renderer, {
            frameBufferType: Three.HalfFloatType,
            depthBuffer: true,
            stencilBuffer: true,
            alpha: true,
        });
        this.renderer.setPixelRatio(__classPrivateFieldGet(this, _HighDefRenderPipeline_devicePixelRatio, "f"));
        this.effectComposer.setMainCamera(camera);
        this.effectComposer.addPass(new RenderPass(this.scene.object3d, camera));
        this.renderer.getSize(size);
        __classPrivateFieldGet(this, _HighDefRenderPipeline_createEffectChain, "f").call(this, this.effectComposer, scene, camera);
        if (__classPrivateFieldGet(this, _HighDefRenderPipeline_useChromaticAberration, "f")) {
            __classPrivateFieldSet(this, _HighDefRenderPipeline_chromaticAberrationEffect, new ChromaticAberrationEffect(__classPrivateFieldGet(this, _HighDefRenderPipeline_chromaticAberrationOptions, "f")), "f");
            this.effectComposer.addPass(new EffectPass(camera, __classPrivateFieldGet(this, _HighDefRenderPipeline_chromaticAberrationEffect, "f")));
        }
        if (__classPrivateFieldGet(this, _HighDefRenderPipeline_useBloom, "f")) {
            __classPrivateFieldSet(this, _HighDefRenderPipeline_bloomEffect, new BloomEffect(__classPrivateFieldGet(this, _HighDefRenderPipeline_bloomEffectOptions, "f")), "f");
            this.effectComposer.addPass(new EffectPass(camera, __classPrivateFieldGet(this, _HighDefRenderPipeline_bloomEffect, "f")));
        }
        if (__classPrivateFieldGet(this, _HighDefRenderPipeline_useSSAO, "f")) {
            __classPrivateFieldSet(this, _HighDefRenderPipeline_ssaoPass, new N8AOPostPass(scene.object3d, camera, size.x, size.y), "f");
            if (__classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoRadius, "f"))
                __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoPass, "f").configuration.aoRadius = __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoRadius, "f");
            if (__classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoDistanceFalloff, "f"))
                __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoPass, "f").configuration.distanceFalloff = __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoDistanceFalloff, "f");
            if (__classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoIntensity, "f"))
                __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoPass, "f").configuration.intensity = __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoIntensity, "f");
            if (__classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoColor, "f"))
                __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoPass, "f").configuration.color = __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoColor, "f");
            // @ts-ignore
            __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoPass, "f").setQualityMode(__classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoQualityMode, "f"));
            __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoPass, "f").configuration.halfRes = __classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoHalfResolution, "f");
            this.effectComposer.addPass(__classPrivateFieldGet(this, _HighDefRenderPipeline_ssaoPass, "f"));
        }
        __classPrivateFieldSet(this, _HighDefRenderPipeline_smaaEffect, new SMAAEffect({ preset: __classPrivateFieldGet(this, _HighDefRenderPipeline_smaaPreset, "f") }), "f");
        this.effectComposer.addPass(new EffectPass(camera, __classPrivateFieldGet(this, _HighDefRenderPipeline_smaaEffect, "f")));
        __classPrivateFieldSet(this, _HighDefRenderPipeline_tonemappingEffect, new ToneMappingEffect({
            blendFunction: __classPrivateFieldGet(this, _HighDefRenderPipeline_tonemappingBlendFunction, "f"),
            whitePoint: __classPrivateFieldGet(this, _HighDefRenderPipeline_tonemappingWhitePoint, "f"),
            middleGrey: __classPrivateFieldGet(this, _HighDefRenderPipeline_tonemappingMiddleGrey, "f"),
            minLuminance: __classPrivateFieldGet(this, _HighDefRenderPipeline_tonemappingMinLuminance, "f"),
            averageLuminance: __classPrivateFieldGet(this, _HighDefRenderPipeline_tonemappingAverageLuminance, "f"),
            mode: __classPrivateFieldGet(this, _HighDefRenderPipeline_tonemappingMode, "f"),
            resolution: __classPrivateFieldGet(this, _HighDefRenderPipeline_tonemappingResolution, "f"),
            adaptationRate: __classPrivateFieldGet(this, _HighDefRenderPipeline_tonemappingAdaptationRate, "f")
        }), "f");
        this.effectComposer.addPass(new EffectPass(camera, __classPrivateFieldGet(this, _HighDefRenderPipeline_tonemappingEffect, "f")));
    }
    onCameraChange(camera) { this.effectComposer.setMainCamera(camera); }
    onResize(width, height) { this.effectComposer.setSize(width, height, false); }
    onRender() {
        this.effectComposer.render();
    }
    getRenderer() { return this.renderer; }
}
_HighDefRenderPipeline_alpha = new WeakMap(), _HighDefRenderPipeline_shadows = new WeakMap(), _HighDefRenderPipeline_smaaEffect = new WeakMap(), _HighDefRenderPipeline_smaaPreset = new WeakMap(), _HighDefRenderPipeline_devicePixelRatio = new WeakMap(), _HighDefRenderPipeline_createEffectChain = new WeakMap(), _HighDefRenderPipeline_tonemappingEffect = new WeakMap(), _HighDefRenderPipeline_tonemappingBlendFunction = new WeakMap(), _HighDefRenderPipeline_tonemappingMode = new WeakMap(), _HighDefRenderPipeline_tonemappingResolution = new WeakMap(), _HighDefRenderPipeline_tonemappingWhitePoint = new WeakMap(), _HighDefRenderPipeline_tonemappingMiddleGrey = new WeakMap(), _HighDefRenderPipeline_tonemappingMinLuminance = new WeakMap(), _HighDefRenderPipeline_tonemappingAverageLuminance = new WeakMap(), _HighDefRenderPipeline_tonemappingAdaptationRate = new WeakMap(), _HighDefRenderPipeline_useSSAO = new WeakMap(), _HighDefRenderPipeline_ssaoPass = new WeakMap(), _HighDefRenderPipeline_ssaoRadius = new WeakMap(), _HighDefRenderPipeline_ssaoDistanceFalloff = new WeakMap(), _HighDefRenderPipeline_ssaoIntensity = new WeakMap(), _HighDefRenderPipeline_ssaoColor = new WeakMap(), _HighDefRenderPipeline_ssaoQualityMode = new WeakMap(), _HighDefRenderPipeline_ssaoHalfResolution = new WeakMap(), _HighDefRenderPipeline_useBloom = new WeakMap(), _HighDefRenderPipeline_bloomEffect = new WeakMap(), _HighDefRenderPipeline_bloomEffectOptions = new WeakMap(), _HighDefRenderPipeline_useChromaticAberration = new WeakMap(), _HighDefRenderPipeline_chromaticAberrationEffect = new WeakMap(), _HighDefRenderPipeline_chromaticAberrationOptions = new WeakMap();
