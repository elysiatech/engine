import * as Three from "three";
export interface MeshWobbleMaterialConstructorArguments {
    time?: number;
    factor?: number;
}
export declare class MeshWobbleMaterial extends Three.MeshStandardMaterial {
    #private;
    get time(): number;
    set time(v: number);
    get factor(): number;
    set factor(v: number);
    constructor({ time, factor, ...parameters }?: Three.MeshStandardMaterialParameters & MeshWobbleMaterialConstructorArguments);
    onBeforeCompile(shader: {
        vertexShader: string;
        uniforms: {
            [uniform: string]: Three.IUniform;
        };
    }): void;
}
