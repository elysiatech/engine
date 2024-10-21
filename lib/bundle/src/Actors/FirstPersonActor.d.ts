import { Actor } from "../Scene/Actor.ts";
import { KeyCode } from "../Input/KeyCode.ts";
import Rapier from "@dimforge/rapier3d-compat";
import * as Three from "three";
import { RigidBody } from "../Physics/RigidBody.ts";
import { PerspectiveCameraActor } from "./PerspectiveCameraActor.ts";
import { CapsuleCollider } from "../Physics/Collider.ts";
export declare class FirstPersonActor extends Actor {
    acceleration: number;
    maxVelocity: number;
    deceleration: number;
    inputVector: Three.Vector3;
    velocity: Three.Vector3;
    grounded: number;
    desiredTranslation: Three.Vector3;
    computedTranslation: Three.Vector3;
    controller?: Rapier.KinematicCharacterController;
    collider: CapsuleCollider;
    rBody: RigidBody;
    rotationRoot: Actor<Three.Object3D<Three.Object3DEventMap>>;
    camera: PerspectiveCameraActor;
    get isDown(): (key: KeyCode | import("../Input/MouseCode.ts").MouseCode) => boolean;
    onCreate(): void;
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
}
