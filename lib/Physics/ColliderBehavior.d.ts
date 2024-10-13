import Rapier from "@dimforge/rapier3d-compat";
import { Behavior } from "../Scene/Behavior";
import { Vector3Like } from "../Math/Vectors";
export declare const Colliders: {
    Box: (scale: Vector3Like) => (ws: Vector3Like) => Rapier.ColliderDesc;
    Cylinder: (height: number, radius: number) => (ws: Vector3Like) => Rapier.ColliderDesc;
    Sphere: (radius: number) => (ws: Vector3Like) => Rapier.ColliderDesc;
    Cone: (height: number, radius: number) => (ws: Vector3Like) => Rapier.ColliderDesc;
    Capsule: (height: number, radius: number) => (ws: Vector3Like) => Rapier.ColliderDesc;
};
type ColliderCreationFunction = (worldScale: Vector3Like) => Rapier.ColliderDesc;
interface ColliderBehaviorArguments {
    type: (worldScale: Vector3Like) => Rapier.ColliderDesc;
    mass?: number;
    density?: number;
    friction?: number;
    restitution?: number;
}
export declare class ColliderBehavior extends Behavior {
    #private;
    type: string;
    colliderDescriptionConstructor: ColliderCreationFunction;
    colliderDescription?: Rapier.ColliderDesc;
    handle?: number;
    get collider(): Rapier.Collider | undefined;
    get mass(): number;
    set mass(mass: number);
    get density(): number;
    set density(density: number);
    get friction(): number;
    set friction(friction: number);
    get restitution(): number;
    set restitution(restitution: number);
    hasParentRigidBody: boolean;
    constructor(args: ColliderBehaviorArguments);
    onCollision?(component: ColliderBehavior, started: boolean): void;
    onContact?(component: ColliderBehavior, maxForceDir: Vector3Like, maxForceMagnitude: number, totalForce: Vector3Like, totalForceMagnitude: number): void;
    private createCollider;
    onEnterScene(): void;
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
    onLeaveScene(): void;
}
export {};
