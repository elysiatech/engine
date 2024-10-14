import { RenderPipeline } from "./RenderPipeline.ts";
import { Scene } from "../Scene/Scene.ts";
import * as Three from "three";
import { BlendFunction, BloomEffectOptions, EffectComposer, SMAAPreset, ToneMappingMode } from "postprocessing";
import { Vector2, WebGLRenderer } from "three";
type HighDefRenderPipelineConstructorArguments = {
    alpha?: boolean;
    shadows?: boolean;
    devicePixelRatio?: number;
    smaaPreset?: SMAAPreset;
    toneMapping?: {
        blendFunction?: BlendFunction;
        adaptive?: boolean;
        mode?: ToneMappingMode;
        resolution?: number;
        whitePoint?: number;
        middleGrey?: number;
        minLuminance?: number;
        averageLuminance?: number;
        adaptationRate?: number;
    };
    ssao?: boolean | {
        aoRadius?: number;
        distanceFalloff?: number;
        intensity?: number;
        color?: Three.Color;
        halfResolution?: boolean;
        qualityMode?: "Low" | "Medium" | "High" | "Ultra" | "Performance";
    };
    bloom?: boolean | BloomEffectOptions;
    chromaticAberration?: boolean | {
        blendFunction?: BlendFunction;
        offset?: Vector2;
        radialModulation: boolean;
        modulationOffset: number;
    };
    createEffectChain?(effectComposer: EffectComposer, scene: Scene, camera: Three.Camera): void;
};
/**
 * A high definition render pipeline that uses pmndr's Postprocessing to render the scene.
 */
export declare class HighDefRenderPipeline extends RenderPipeline {
    #private;
    get devicePixelRatio(): number;
    set devicePixelRatio(value: number);
    constructor(args?: HighDefRenderPipelineConstructorArguments);
    onCreate(scene: Scene, output: HTMLCanvasElement): void;
    onCameraChange(camera: Three.Camera): void;
    onResize(width: number, height: number): void;
    onRender(): void;
    getRenderer(): WebGLRenderer;
    private renderer;
    private effectComposer;
    private scene?;
    private output?;
}
export {};
