import { Actor } from "../Scene/Actor.ts";
import * as Three from "three";
export declare class MeshActor extends Actor<Three.Mesh> {
    #private;
    type: string;
    get geometry(): Three.BufferGeometry<Three.NormalBufferAttributes>;
    set geometry(value: Three.BufferGeometry<Three.NormalBufferAttributes>);
    get material(): Three.Material;
    set material(value: Three.Material);
    get castShadow(): boolean;
    set castShadow(value: boolean);
    get receiveShadow(): boolean;
    set receiveShadow(value: boolean);
    get debug(): boolean;
    set debug(value: boolean);
    constructor(geometry: Three.BufferGeometry, material: Three.Material, castShadow?: boolean, receiveShadow?: boolean);
}
