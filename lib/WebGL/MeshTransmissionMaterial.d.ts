import * as Three from 'three';
import { Application } from "../Core/ApplicationEntry";
import { Scene } from "../Scene/Scene";
interface Uniform<T> {
    value: T;
}
declare class DiscardMaterial extends Three.ShaderMaterial {
    constructor();
}
export declare class MeshTransmissionMaterial extends Three.MeshPhysicalMaterial {
    uniforms: {
        chromaticAberration: Uniform<number>;
        transmission: Uniform<number>;
        transmissionMap: Uniform<Three.Texture | null>;
        _transmission: Uniform<number>;
        thickness: Uniform<number>;
        roughness: Uniform<number>;
        thicknessMap: Uniform<Three.Texture | null>;
        attenuationDistance: Uniform<number>;
        attenuationColor: Uniform<Three.Color>;
        anisotropicBlur: Uniform<number>;
        time: Uniform<number>;
        distortion: Uniform<number>;
        distortionScale: Uniform<number>;
        temporalDistortion: Uniform<number>;
        buffer: Uniform<Three.Texture | null>;
    };
    constructor({ samples, transmissionSampler, chromaticAberration, transmission, _transmission, transmissionMap, roughness, thickness, thicknessMap, attenuationDistance, attenuationColor, anisotropicBlur, time, distortion, distortionScale, temporalDistortion, buffer }?: {
        samples?: number | undefined;
        transmissionSampler?: boolean | undefined;
        chromaticAberration?: number | undefined;
        transmission?: number | undefined;
        _transmission?: number | undefined;
        transmissionMap?: null | undefined;
        roughness?: number | undefined;
        thickness?: number | undefined;
        thicknessMap?: null | undefined;
        attenuationDistance?: number | undefined;
        attenuationColor?: Three.Color | undefined;
        anisotropicBlur?: number | undefined;
        time?: number | undefined;
        distortion?: number | undefined;
        distortionScale?: number | undefined;
        temporalDistortion?: number | undefined;
        buffer?: null | undefined;
    });
    fboBack: Three.WebGLRenderTarget<Three.Texture>;
    fboMain: Three.WebGLRenderTarget<Three.Texture>;
    oldBg: any;
    oldTone: any;
    oldSide: any;
    mtmParams: {
        backside: boolean;
        thickness: number;
        backsideThickness: number;
    };
    discardMat: DiscardMaterial;
    onUpdate(time: number, app: Application, scene: Scene, mesh: Three.Mesh): void;
}
export {};
