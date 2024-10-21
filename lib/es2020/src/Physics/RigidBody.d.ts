import { Behavior } from "../Scene/Behavior.ts";
import { Vector3Like } from "../Math/Vectors.ts";
import * as Rapier from "@dimforge/rapier3d-compat";
export declare enum RigidbodyType {
    Static = 0,
    Dynamic = 1,
    KinematicVelocity = 2,
    KinematicPosition = 3
}
export declare class RigidBody extends Behavior {
    #private;
    type: string;
    description: Rapier.RigidBodyDesc;
    get mass(): number;
    set mass(mass: number);
    get linearDamping(): number;
    set linearDamping(damping: number);
    get angularDamping(): number;
    set angularDamping(damping: number);
    get linearVelocity(): Vector3Like;
    set linearVelocity(velocity: Vector3Like);
    get angularVelocity(): Vector3Like;
    set angularVelocity(velocity: Vector3Like);
    get ccdEnabled(): boolean;
    set ccdEnabled(enabled: boolean);
    constructor(type: RigidbodyType);
    onEnable(): void;
    onDisable(): void;
    applyImpulse(impulse: Vector3Like): void;
    applyForce(force: Vector3Like): void;
    applyTorque(torque: Vector3Like): void;
}
