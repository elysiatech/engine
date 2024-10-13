import { Actor } from "../Scene/Actor";
import * as Three from "three";
export declare class MeshActor extends Actor<Three.Mesh> {
    #private;
    type: string;
    get geometry(): any;
    set geometry(value: any);
    get material(): Three.Material;
    set material(value: Three.Material);
    get castShadow(): any;
    set castShadow(value: any);
    get receiveShadow(): any;
    set receiveShadow(value: any);
    get debug(): boolean;
    set debug(value: boolean);
    constructor(geometry: Three.BufferGeometry, material: Three.Material, castShadow?: boolean, receiveShadow?: boolean);
}
