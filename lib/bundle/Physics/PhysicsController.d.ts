import { Scene } from "../Scene/Scene.ts";
import * as Three from "three";
import { ColliderBehavior } from "./ColliderBehavior.ts";
import { RigidBodyBehavior } from "./RigidBody.ts";
import { Destroyable } from "../Core/Lifecycle.ts";
import Rapier from '@dimforge/rapier3d-compat';
export interface PhysicsControllerConstructorArguments {
    gravity?: Three.Vector3;
    debug?: boolean;
}
export declare class PhysicsController implements Destroyable {
    #private;
    world?: Rapier.World;
    readonly gravity: Three.Vector3;
    readonly colliders: Map<number, {
        component: ColliderBehavior;
    }>;
    readonly rigidBodies: Map<number, {
        component: RigidBodyBehavior;
    }>;
    readonly characterControllers: Map<string, {
        instance: Rapier.KinematicCharacterController;
    }>;
    scene?: Scene;
    queue?: Rapier.EventQueue;
    get debug(): boolean;
    set debug(value: boolean);
    constructor(args?: PhysicsControllerConstructorArguments);
    init(scene: Scene): Promise<void>;
    start(): void;
    addCollider(collider: ColliderBehavior): void;
    getCollider(handle?: number): Rapier.Collider | undefined;
    destroyCollider(collider: ColliderBehavior): void;
    addRigidBody(rigidBody: RigidBodyBehavior): void;
    getRigidBody(handle?: number): Rapier.RigidBody | undefined;
    destroyRigidBody(rigidBody: RigidBodyBehavior): void;
    addCharacterController(args: {
        offset: number;
    }): string;
    getCharacterController(handle?: string): Rapier.KinematicCharacterController | undefined;
    destroyCharacterController(handle?: string): void;
    updatePhysicsWorld(scene: Scene, delta: number, elapsed: number): void;
    destructor(): void;
}
