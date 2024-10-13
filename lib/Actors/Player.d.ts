import { Actor } from "../Scene/Actor";
import { ColliderBehavior } from "../Physics/ColliderBehavior";
import Rapier from "@dimforge/rapier3d-compat";
import * as Three from "three";
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
    rBody: any;
    rotationRoot: any;
    camera: any;
    get isDown(): any;
    constructor();
    onCreate(): void;
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
}
