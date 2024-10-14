import { RenderPipeline } from "./RenderPipeline.ts";
import { Scene } from "../Scene/Scene.ts";
import * as Three from "three";
type BasicRenderPipelineArguments = Three.WebGLRendererParameters & {
    toneMapping?: Three.ToneMapping;
    toneMappingExposure?: number;
    devicePixelRatio?: number;
    shadows?: boolean;
};
/**
 * A basic render pipeline that uses Three.js to render the scene with the default WebGLRenderer.
 */
export declare class BasicRenderPipeline extends RenderPipeline {
    constructor(args?: BasicRenderPipelineArguments);
    onCreate(scene: Scene, output: HTMLCanvasElement): void;
    onResize(width: number, height: number): void;
    onRender(scene: Scene, camera: Three.Camera): void;
    getRenderer(): Three.WebGLRenderer;
    private renderer?;
    private args;
}
export {};
