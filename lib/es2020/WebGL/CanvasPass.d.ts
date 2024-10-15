import { ShaderMaterial } from "three";
import * as Three from "three";
import { ShaderPass } from "postprocessing";
export declare class CanvasMaterial extends ShaderMaterial {
    constructor(canvas: Three.CanvasTexture);
}
export declare class CanvasPass extends ShaderPass {
    constructor(canvas: Three.CanvasTexture);
}
