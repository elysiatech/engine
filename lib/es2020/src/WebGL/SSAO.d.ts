declare class $05f6997e4b65da14$export$2d57db20b5eb5e0a extends $5Whe3$Pass {
    /**
     *
     * @param {THREE.Scene} scene
     * @param {THREE.Camera} camera
     * @param {number} width
     * @param {number} height
     *
     * @property {THREE.Scene} scene
     * @property {THREE.Camera} camera
     * @property {number} width
     * @property {number} height
     */ constructor(scene: THREE.Scene, camera: THREE.Camera, width?: number, height?: number);
    width: number;
    height: number;
    camera: THREE.Camera;
    scene: THREE.Scene;
    /**
     * @type {Proxy & {
     * aoSamples: number,
     * aoRadius: number,
     * denoiseSamples: number,
     * denoiseRadius: number,
     * distanceFalloff: number,
     * intensity: number,
     * denoiseIterations: number,
     * renderMode: 0 | 1 | 2 | 3 | 4,
     * color: THREE.Color,
     * gammaCorrection: boolean,
     * logarithmicDepthBuffer: boolean
     * screenSpaceRadius: boolean,
     * halfRes: boolean,
     * depthAwareUpsampling: boolean,
     * autoRenderBeauty: boolean
     * colorMultiply: boolean
     * }
     */ configuration: ProxyConstructor & {
        aoSamples: number;
        aoRadius: number;
        denoiseSamples: number;
        denoiseRadius: number;
        distanceFalloff: number;
        intensity: number;
        denoiseIterations: number;
        renderMode: 0 | 1 | 2 | 3 | 4;
        color: THREE.Color;
        gammaCorrection: boolean;
        logarithmicDepthBuffer: boolean;
        screenSpaceRadius: boolean;
        halfRes: boolean;
        depthAwareUpsampling: boolean;
        autoRenderBeauty: boolean;
        colorMultiply: boolean;
    };
    autoDetectTransparency: boolean;
    beautyRenderTarget: $5Whe3$WebGLRenderTarget<import("three").Texture>;
    /** @type {THREE.Vector3[]} */ samples: THREE.Vector3[];
    /** @type {THREE.Vector2[]} */ samplesDenoise: THREE.Vector2[];
    frame: number;
    lastViewMatrix: $5Whe3$Matrix4;
    lastProjectionMatrix: $5Whe3$Matrix4;
    writeTargetInternal: $5Whe3$WebGLRenderTarget<import("three").Texture>;
    readTargetInternal: $5Whe3$WebGLRenderTarget<import("three").Texture>;
    accumulationRenderTarget: $5Whe3$WebGLRenderTarget<import("three").Texture>;
    /** @type {THREE.DataTexture} */ bluenoise: THREE.DataTexture;
    accumulationQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5;
    lastTime: number;
    timeRollingAverage: number;
    _r: $5Whe3$Vector2;
    _c: $5Whe3$Color;
    configureHalfResTargets(): void;
    depthDownsampleTarget: $5Whe3$WebGLRenderTarget<import("three").Texture> | $5Whe3$WebGLMultipleRenderTargets | null | undefined;
    depthDownsampleQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5 | null | undefined;
    detectTransparency(): void;
    configureTransparencyTarget(): void;
    transparencyRenderTargetDWFalse: $5Whe3$WebGLRenderTarget<import("three").Texture> | null | undefined;
    transparencyRenderTargetDWTrue: $5Whe3$WebGLRenderTarget<import("three").Texture> | null | undefined;
    depthCopyPass: $e4ca8dcb0218f846$export$dcd670d73db751f5 | null | undefined;
    renderTransparency(renderer: any): void;
    configureSampleDependentPasses(): void;
    configureAOPass(logarithmicDepthBuffer?: boolean, ortho?: boolean): void;
    effectShaderQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5 | undefined;
    configureDenoisePass(logarithmicDepthBuffer?: boolean, ortho?: boolean): void;
    poissonBlurQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5 | undefined;
    configureEffectCompositer(logarithmicDepthBuffer?: boolean, ortho?: boolean): void;
    effectCompositerQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5 | undefined;
    /**
     *
     * @param {Number} n
     * @returns {THREE.Vector3[]}
     */ generateHemisphereSamples(n: number): THREE.Vector3[];
    /**
     *
     * @param {number} numSamples
     * @param {number} numRings
     * @returns {THREE.Vector2[]}
     */ generateDenoiseSamples(numSamples: number, numRings: number): THREE.Vector2[];
    setSize(width: any, height: any): void;
    firstFrame(): void;
    needsFrame: boolean | undefined;
    render(renderer: any, writeBuffer: any, readBuffer: any, deltaTime: any, maskActive: any): void;
    debugMode: boolean | undefined;
    /**
     * Enables the debug mode of the AO, meaning the lastTime value will be updated.
     */ enableDebugMode(): void;
    /**
     * Disables the debug mode of the AO, meaning the lastTime value will not be updated.
     */ disableDebugMode(): void;
    /**
     * Sets the display mode of the AO
     * @param {"Combined" | "AO" | "No AO" | "Split" | "Split AO"} mode - The display mode.
     */ setDisplayMode(mode: "Combined" | "AO" | "No AO" | "Split" | "Split AO"): void;
    /**
     *
     * @param {"Performance" | "Low" | "Medium" | "High" | "Ultra"} mode
     */ setQualityMode(mode: "Performance" | "Low" | "Medium" | "High" | "Ultra"): void;
}
declare class $87431ee93b037844$export$2489f9981ab0fa82 extends $5Whe3$Pass1 {
    /**
     *
     * @param {THREE.Scene} scene
     * @param {THREE.Camera} camera
     * @param {number} width
     * @param {number} height
     *
     * @property {THREE.Scene} scene
     * @property {THREE.Camera} camera
     * @property {number} width
     * @property {number} height
     */ constructor(scene: THREE.Scene, camera: THREE.Camera, width?: number, height?: number);
    width: number;
    height: number;
    clear: boolean;
    camera: THREE.Camera;
    scene: THREE.Scene;
    /**
     * @type {Proxy & {
     * aoSamples: number,
     * aoRadius: number,
     * denoiseSamples: number,
     * denoiseRadius: number,
     * distanceFalloff: number,
     * intensity: number,
     * denoiseIterations: number,
     * renderMode: 0 | 1 | 2 | 3 | 4,
     * color: THREE.Color,
     * gammaCorrection: boolean,
     * logarithmicDepthBuffer: boolean
     * screenSpaceRadius: boolean,
     * halfRes: boolean,
     * depthAwareUpsampling: boolean
     * colorMultiply: boolean
     * }
     */ autosetGamma: ProxyConstructor & {
        aoSamples: number;
        aoRadius: number;
        denoiseSamples: number;
        denoiseRadius: number;
        distanceFalloff: number;
        intensity: number;
        denoiseIterations: number;
        renderMode: 0 | 1 | 2 | 3 | 4;
        color: THREE.Color;
        gammaCorrection: boolean;
        logarithmicDepthBuffer: boolean;
        screenSpaceRadius: boolean;
        halfRes: boolean;
        depthAwareUpsampling: boolean;
        colorMultiply: boolean;
    };
    configuration: {
        aoSamples: number;
        aoRadius: number;
        aoTones: number;
        denoiseSamples: number;
        denoiseRadius: number;
        distanceFalloff: number;
        intensity: number;
        denoiseIterations: number;
        renderMode: number;
        biasOffset: number;
        biasMultiplier: number;
        color: $5Whe3$Color;
        gammaCorrection: boolean;
        logarithmicDepthBuffer: boolean;
        screenSpaceRadius: boolean;
        halfRes: boolean;
        depthAwareUpsampling: boolean;
        colorMultiply: boolean;
        transparencyAware: boolean;
        accumulate: boolean;
    };
    autoDetectTransparency: boolean;
    /** @type {THREE.Vector3[]} */ samples: THREE.Vector3[];
    /** @type {THREE.Vector2[]} */ samplesDenoise: THREE.Vector2[];
    frames: number;
    lastViewMatrix: $5Whe3$Matrix4;
    lastProjectionMatrix: $5Whe3$Matrix4;
    copyQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5;
    writeTargetInternal: $5Whe3$WebGLRenderTarget<import("three").Texture>;
    readTargetInternal: $5Whe3$WebGLRenderTarget<import("three").Texture>;
    outputTargetInternal: $5Whe3$WebGLRenderTarget<import("three").Texture>;
    accumulationRenderTarget: $5Whe3$WebGLRenderTarget<import("three").Texture>;
    accumulationQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5;
    /** @type {THREE.DataTexture} */ bluenoise: THREE.DataTexture;
    lastTime: number;
    timeRollingAverage: number;
    _r: $5Whe3$Vector2;
    _c: $5Whe3$Color;
    configureHalfResTargets(): void;
    depthDownsampleTarget: $5Whe3$WebGLRenderTarget<import("three").Texture> | $5Whe3$WebGLMultipleRenderTargets | null | undefined;
    depthDownsampleQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5 | null | undefined;
    detectTransparency(): void;
    configureTransparencyTarget(): void;
    transparencyRenderTargetDWFalse: $5Whe3$WebGLRenderTarget<import("three").Texture> | null | undefined;
    transparencyRenderTargetDWTrue: $5Whe3$WebGLRenderTarget<import("three").Texture> | null | undefined;
    depthCopyPass: $e4ca8dcb0218f846$export$dcd670d73db751f5 | null | undefined;
    renderTransparency(renderer: any): void;
    configureSampleDependentPasses(): void;
    configureAOPass(logarithmicDepthBuffer?: boolean, ortho?: boolean): void;
    effectShaderQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5 | undefined;
    configureDenoisePass(logarithmicDepthBuffer?: boolean, ortho?: boolean): void;
    poissonBlurQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5 | undefined;
    configureEffectCompositer(logarithmicDepthBuffer?: boolean, ortho?: boolean): void;
    effectCompositerQuad: $e4ca8dcb0218f846$export$dcd670d73db751f5 | undefined;
    /**
     *
     * @param {Number} n
     * @returns {THREE.Vector3[]}
     */ generateHemisphereSamples(n: number): THREE.Vector3[];
    /**
     *
     * @param {number} numSamples
     * @param {number} numRings
     * @returns {THREE.Vector2[]}
     */ generateDenoiseSamples(numSamples: number, numRings: number): THREE.Vector2[];
    setSize(width: any, height: any): void;
    setDepthTexture(depthTexture: any): void;
    depthTexture: any;
    firstFrame(): void;
    needsFrame: boolean | undefined;
    render(renderer: any, inputBuffer: any, outputBuffer: any): void;
    frame: number | undefined;
    debugMode: boolean | undefined;
    /**
     * Enables the debug mode of the AO, meaning the lastTime value will be updated.
     */ enableDebugMode(): void;
    /**
     * Disables the debug mode of the AO, meaning the lastTime value will not be updated.
     */ disableDebugMode(): void;
    /**
     * Sets the display mode of the AO
     * @param {"Combined" | "AO" | "No AO" | "Split" | "Split AO"} mode - The display mode.
     */ setDisplayMode(mode: "Combined" | "AO" | "No AO" | "Split" | "Split AO"): void;
    /**
     *
     * @param {"Performance" | "Low" | "Medium" | "High" | "Ultra"} mode
     */ setQualityMode(mode: "Performance" | "Low" | "Medium" | "High" | "Ultra"): void;
}
import { Pass as $5Whe3$Pass } from "three/examples/jsm/postprocessing/Pass.js";
import { WebGLRenderTarget as $5Whe3$WebGLRenderTarget } from "three";
import { Matrix4 as $5Whe3$Matrix4 } from "three";
declare class $e4ca8dcb0218f846$export$dcd670d73db751f5 {
    constructor(material: any);
    _mesh: $5Whe3$Mesh<$5Whe3$BufferGeometry<import("three").NormalBufferAttributes>, any, import("three").Object3DEventMap>;
    render(renderer: any): void;
    set material(value: any);
    get material(): any;
    dispose(): void;
}
import { Vector2 as $5Whe3$Vector2 } from "three";
import { Color as $5Whe3$Color } from "three";
import { WebGLMultipleRenderTargets as $5Whe3$WebGLMultipleRenderTargets } from "three";
import { Pass as $5Whe3$Pass1 } from "postprocessing";
import { BufferGeometry as $5Whe3$BufferGeometry } from "three";
import { Mesh as $5Whe3$Mesh } from "three";
export { $05f6997e4b65da14$export$2d57db20b5eb5e0a as N8AOPass, $87431ee93b037844$export$2489f9981ab0fa82 as N8AOPostPass };
