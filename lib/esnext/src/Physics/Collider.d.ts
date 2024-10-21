import { Actor } from "../Scene/Actor.ts";
import { Vector3Like } from "../Math/Vectors.ts";
import * as Three from "three";
import Rapier from "@dimforge/rapier3d-compat";
declare enum ColliderType {
    Box = 0,
    Cylinder = 1,
    Sphere = 2,
    Cone = 3,
    Capsule = 4,
    Mesh = 5
}
export declare abstract class Collider<T extends ColliderType> extends Actor {
    #private;
    type: string;
    get mass(): number;
    set mass(mass: number);
    get density(): number;
    set density(density: number);
    get friction(): number;
    set friction(friction: number);
    get restitution(): number;
    set restitution(restitution: number);
    hasParentRigidBody: boolean;
    abstract readonly colliderType: ColliderType;
    abstract colliderDescriptionConstructor(worldScale: Vector3Like): Rapier.ColliderDesc;
    onCollision?(component: Collider<any>, started: boolean): void;
    onContact?(component: Collider<any>, maxForceDir: Vector3Like, maxForceMagnitude: number, totalForce: Vector3Like, totalForceMagnitude: number): void;
    onEnable(): void;
    onDisable(): void;
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
}
export declare class BoxCollider extends Collider<ColliderType.Box> {
    readonly colliderType = ColliderType.Box;
    colliderDescriptionConstructor(worldScale: Vector3Like): Rapier.ColliderDesc;
}
export declare class CylinderCollider extends Collider<ColliderType.Cylinder> {
    height: number;
    radius: number;
    readonly colliderType = ColliderType.Cylinder;
    constructor(height: number, radius: number);
    colliderDescriptionConstructor(): Rapier.ColliderDesc;
}
export declare class SphereCollider extends Collider<ColliderType.Sphere> {
    radius: number;
    readonly colliderType = ColliderType.Sphere;
    constructor(radius: number);
    colliderDescriptionConstructor(): Rapier.ColliderDesc;
}
export declare class ConeCollider extends Collider<ColliderType.Cone> {
    height: number;
    radius: number;
    readonly colliderType = ColliderType.Cone;
    constructor(height: number, radius: number);
    colliderDescriptionConstructor(): Rapier.ColliderDesc;
}
export declare class CapsuleCollider extends Collider<ColliderType.Capsule> {
    height: number;
    radius: number;
    readonly colliderType = ColliderType.Capsule;
    constructor(height: number, radius: number);
    colliderDescriptionConstructor(): Rapier.ColliderDesc;
}
export declare class MeshCollider extends Collider<ColliderType.Mesh> {
    points: Float32Array | Three.BufferGeometry;
    readonly colliderType = ColliderType.Mesh;
    constructor(points: Float32Array | Three.BufferGeometry);
    colliderDescriptionConstructor(): Rapier.ColliderDesc;
}
export {};
