import { Actor } from "../Scene/Actor.ts";
import { ColliderBehavior } from "../Physics/ColliderBehavior.ts";
import { KeyCode } from "../Input/KeyCode.ts";
import Rapier from "@dimforge/rapier3d-compat";
import * as Three from "three";
import { RigidBodyBehavior } from "../Physics/RigidBody.ts";
import { PerspectiveCameraActor } from "./PerspectiveCameraActor.ts";
export declare class Player extends Actor {
    acceleration: number;
    maxVelocity: number;
    deceleration: number;
    inputVector: Three.Vector3;
    velocity: Three.Vector3;
    grounded: number;
    desiredTranslation: Three.Vector3;
    computedTranslation: Three.Vector3;
    controller?: Rapier.KinematicCharacterController;
    collider: ColliderBehavior;
    rBody: RigidBodyBehavior;
    rotationRoot: Actor<Three.Object3D<Three.Object3DEventMap>>;
    camera: PerspectiveCameraActor;
    get isDown(): (key: KeyCode | import("../mod.ts").MouseCode) => boolean;
    constructor();
    onCreate(): void;
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
}
