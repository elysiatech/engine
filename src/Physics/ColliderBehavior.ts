import * as Three from "three";
import Rapier from "@dimforge/rapier3d-compat";
import { Behavior } from "../Scene/Behavior.ts";
import { Vector3Like } from "../Math/Vectors.ts";
import { findAncestorRigidbody } from "./FindAncestorRigidbody.ts";

export const Colliders = {
    Box: (scale: Vector3Like) => (ws: Vector3Like) =>
    	Rapier.ColliderDesc.cuboid((scale.x * ws.x) / 2, (scale.y * ws.y) / 2, (scale.z * ws.z) / 2),
    Cylinder: (height: number, radius: number) => (ws: Vector3Like) =>
        Rapier.ColliderDesc.cylinder(height / 2, radius),
    Sphere: (radius: number) => (ws: Vector3Like) =>
        Rapier.ColliderDesc.ball(radius * ws.x),
    Cone: (height: number, radius: number) => (ws: Vector3Like) =>
        Rapier.ColliderDesc.cone((height * ws.y) / 2, radius * ws.x),
    Capsule: (height: number, radius: number) => (ws: Vector3Like) =>
        Rapier.ColliderDesc.capsule((height * ws.y) / 2, radius * ws.x),
};

type ColliderCreationFunction = (worldScale: Vector3Like) => Rapier.ColliderDesc;

interface ColliderBehaviorArguments
{
    type: (worldScale: Vector3Like) => Rapier.ColliderDesc;
    mass?: number;
    density?: number;
    friction?: number;
    restitution?: number;
}

export class ColliderBehavior extends Behavior
{
    override type = "ColliderBehavior";

    colliderDescriptionConstructor: ColliderCreationFunction;

    colliderDescription?: Rapier.ColliderDesc;

    handle?: number;

    get collider(): Rapier.Collider | undefined
    {
        return this.scene?.physics?.getCollider(this.handle);
    }

    get mass() { return this.#mass;
}
    set mass(mass: number) {
        this.#mass = mass;
        if (this.collider) {
            this.collider.setMass(mass);
        }
    }

    get density() {
        return this.#density;
    }
    set density(density: number) {
        this.#density = density;
        if (this.collider) {
            this.collider.setDensity(density);
        }
    }

    get friction() {
        return this.#friction;
    }
    set friction(friction: number) {
        this.#friction = friction;
        if (this.collider) {
            this.collider.setFriction(friction);
        }
    }

    get restitution() {
        return this.#restitution;
    }
    set restitution(restitution: number) {
        this.#restitution = restitution;
        if (this.collider) {
            this.collider.setRestitution(restitution);
        }
    }

    hasParentRigidBody = false;

    constructor(args: ColliderBehaviorArguments) {
        super();
        this.addTag(ColliderBehavior);
        this.colliderDescriptionConstructor = args.type;
        if (args.mass) this.#mass = args.mass;
        if (args.density) this.#density = args.density;
        if (args.friction) this.#friction = args.friction;
        if (args.restitution) this.#restitution = args.restitution;
    }

    onCollision?(component: ColliderBehavior, started: boolean): void;
    onContact?(
        component: ColliderBehavior,
        maxForceDir: Vector3Like,
        maxForceMagnitude: number,
        totalForce: Vector3Like,
        totalForceMagnitude: number,
    ): void;

    private createCollider() {
        if (!this.scene) return;
        this.scene.physics?.destroyCollider(this);
        const worldScale =
            this.parent?.parent?.object3d.getWorldScale(temp.v1) ??
            temp.v1.setScalar(1);
        this.colliderDescription =
            this.colliderDescriptionConstructor(worldScale);
        // todo: add mass and other collider properties here.
        this.colliderDescription.setMass(this.#mass);
        this.colliderDescription.setDensity(this.#density);
        this.colliderDescription.setFriction(this.#friction);
        this.colliderDescription.setRestitution(this.#restitution);
        this.onCollision &&
            this.colliderDescription.setActiveEvents(
                Rapier.ActiveEvents.COLLISION_EVENTS,
            );
        this.onContact &&
            this.colliderDescription.setActiveEvents(
                Rapier.ActiveEvents.CONTACT_FORCE_EVENTS,
            );
        this.scene.physics!.addCollider(this);
    }

    onEnterScene() {
        if (this.collider) return;
        this.createCollider();
    }

    override onBeforePhysicsUpdate(delta: number, elapsed: number) {
        const c = this.collider;
        if (!c) return;

        if (
            this.#previousPosition.equals(this.parent!.object3d.position) &&
            this.#previousRotation.equals(this.parent!.object3d.quaternion)
        )
            return;

        // if the world scale has changed, we need to recreate the collider.
        if (
            !this.#previousScale.equals(
                this.parent!.object3d.getWorldScale(temp.v1),
            )
        ) {
            this.#previousScale.copy(temp.v1);
            // need to recreate the collider with the new scale.
        }

        this.#previousPosition.copy(this.parent!.object3d.position);
        this.#previousRotation.copy(this.parent!.object3d.quaternion);

        if (this.hasParentRigidBody) {
            const parentRigidBody = findAncestorRigidbody(this.parent!);
            if (!parentRigidBody || !parentRigidBody.rBody) return;

            const rigidBody = parentRigidBody.rBody;

            // Create matrices
            const rbWorldMatrix = temp.m1.set(
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
            );
            const parentWorldMatrix = temp.m2.set(
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
            );
            const relativeMatrix = temp.m3.set(
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
            );

            // Set rigid body's world transform
            rbWorldMatrix.compose(
                temp.v1.set(
                    rigidBody.translation().x,
                    rigidBody.translation().y,
                    rigidBody.translation().z,
                ),
                temp.q1.set(
                    rigidBody.rotation().x,
                    rigidBody.rotation().y,
                    rigidBody.rotation().z,
                    rigidBody.rotation().w,
                ),
                temp.v2.set(1, 1, 1), // Assuming no scale
            );

            // Get collider parent's world transform
            this.parent!.object3d.updateWorldMatrix(true, false);
            parentWorldMatrix.copy(this.parent!.object3d.matrixWorld);

            // Calculate relative transform
            relativeMatrix
                .copy(rbWorldMatrix)
                .invert()
                .multiply(parentWorldMatrix);

            // Extract position and rotation from the relative matrix
            const relativePosition = temp.v3.setScalar(0);
            const relativeQuaternion = temp.q2.set(0, 0, 0, 1);
            const relativeScale = temp.v4.setScalar(1);
            relativeMatrix.decompose(
                relativePosition,
                relativeQuaternion,
                relativeScale,
            );

            // Set collider's position and rotation relative to the parent rigid body
            c.setTranslationWrtParent(relativePosition);
            c.setRotationWrtParent(relativeQuaternion);
        } else {
            this.parent!.object3d.getWorldPosition(temp.v1);
            this.parent!.object3d.getWorldQuaternion(temp.q1);
            c.setTranslation(temp.v1);
            c.setRotation(temp.q1);
        }
    }

    onLeaveScene() {
        this.scene?.physics!.destroyCollider(this);
    }

    #mass = 1;
    #density = 1;
    #friction = 0.5;
    #restitution = 0.5;

    #previousPosition = new Three.Vector3();
    #previousRotation = new Three.Quaternion();
    #previousScale = new Three.Vector3();
}

const temp = {
    q1: new Three.Quaternion(),
    q2: new Three.Quaternion(),
    q3: new Three.Quaternion(),
    q4: new Three.Quaternion(),
    v1: new Three.Vector3(),
    v2: new Three.Vector3(),
    v3: new Three.Vector3(),
    v4: new Three.Vector3(),
    m1: new Three.Matrix4(),
    m2: new Three.Matrix4(),
    m3: new Three.Matrix4(),
    m4: new Three.Matrix4(),
};
