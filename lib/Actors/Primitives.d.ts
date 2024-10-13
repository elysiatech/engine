import { MeshActor } from "./MeshActor";
import * as Three from "three";
/**
 * A basic modelRoot actor.
 */
export declare class CubeActor extends MeshActor {
    get material(): Three.MeshStandardMaterial;
    constructor(color?: Three.ColorRepresentation, position?: Three.Vector3, rotation?: Three.Euler, scale?: Three.Vector3);
}
/**
 * A basic sphere actor.
 */
export declare class SphereActor extends MeshActor {
    get material(): Three.MeshStandardMaterial;
    constructor(color?: Three.ColorRepresentation, position?: Three.Vector3, radius?: number);
}
/**
 * A basic plane actor.
 */
export declare class PlaneActor extends MeshActor {
    constructor(color?: Three.ColorRepresentation, position?: Three.Vector3, rotation?: Three.Euler, scale?: Three.Vector3);
}
/**
 * A basic cylinder actor.
 */
export declare class CylinderActor extends MeshActor {
    get radius(): any;
    set radius(value: any);
    get height(): any;
    set height(value: any);
    constructor(color?: Three.ColorRepresentation, position?: Three.Vector3, radius?: number, height?: number);
}
/**
 * A basic cone actor.
 */
export declare class ConeActor extends MeshActor {
    get radius(): any;
    set radius(value: any);
    get height(): any;
    set height(value: any);
    constructor(color?: Three.ColorRepresentation, position?: Three.Vector3, radius?: number, height?: number);
}
/**
 * A basic torus actor.
 */
export declare class TorusActor extends MeshActor {
    get radius(): any;
    set radius(value: any);
    get tube(): any;
    set tube(value: any);
    constructor(color?: Three.ColorRepresentation, position?: Three.Vector3, radius?: number, tube?: number);
}
