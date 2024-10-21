import * as Three from "three";
import * as Rapier from "@dimforge/rapier3d-compat";
import { s_OnLoad, s_OnStart, s_OnUpdate } from "../Scene/Internal.ts";
import { Scene } from "../Scene/Scene.ts";
import { Collider } from "./Collider.ts";
import { RigidBody } from "./RigidBody.ts";
interface PhysicsWorldConstructorArguments {
    gravity?: Three.Vector3;
    debug?: boolean;
}
export declare class PhysicsWorld {
    #private;
    readonly gravity: Three.Vector3;
    world: Rapier.World;
    scene: Scene;
    constructor(args?: PhysicsWorldConstructorArguments);
    addCollider(c: Collider<any>): void;
    getCollider(c: Collider<any>): Rapier.Collider | undefined;
    removeCollider(c: Collider<any>): void;
    addRigidBody(r: RigidBody): void;
    getRigidBody(r: RigidBody): Rapier.RigidBody | undefined;
    removeRigidBody(r: RigidBody): void;
    [s_OnLoad](scene: Scene): Promise<void>;
    [s_OnStart](): void;
    [s_OnUpdate](d: number, e: number): void;
    destructor(): void;
}
export {};
