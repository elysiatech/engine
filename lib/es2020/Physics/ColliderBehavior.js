var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ColliderBehavior_mass, _ColliderBehavior_density, _ColliderBehavior_friction, _ColliderBehavior_restitution, _ColliderBehavior_previousPosition, _ColliderBehavior_previousRotation, _ColliderBehavior_previousScale;
import * as Three from "three";
import Rapier from "@dimforge/rapier3d-compat";
import { Behavior } from "../Scene/Behavior.js";
import { findAncestorRigidbody } from "./FindAncestorRigidbody.js";
export const Colliders = {
    Box: (scale) => (ws) => Rapier.ColliderDesc.cuboid((scale.x * ws.x) / 2, (scale.y * ws.y) / 2, (scale.z * ws.z) / 2),
    Cylinder: (height, radius) => (ws) => Rapier.ColliderDesc.cylinder(height / 2, radius),
    Sphere: (radius) => (ws) => Rapier.ColliderDesc.ball(radius * ws.x),
    Cone: (height, radius) => (ws) => Rapier.ColliderDesc.cone((height * ws.y) / 2, radius * ws.x),
    Capsule: (height, radius) => (ws) => Rapier.ColliderDesc.capsule((height * ws.y) / 2, radius * ws.x),
};
export class ColliderBehavior extends Behavior {
    get collider() {
        return this.scene?.physics?.getCollider(this.handle);
    }
    get mass() {
        return __classPrivateFieldGet(this, _ColliderBehavior_mass, "f");
    }
    set mass(mass) {
        __classPrivateFieldSet(this, _ColliderBehavior_mass, mass, "f");
        if (this.collider) {
            this.collider.setMass(mass);
        }
    }
    get density() {
        return __classPrivateFieldGet(this, _ColliderBehavior_density, "f");
    }
    set density(density) {
        __classPrivateFieldSet(this, _ColliderBehavior_density, density, "f");
        if (this.collider) {
            this.collider.setDensity(density);
        }
    }
    get friction() {
        return __classPrivateFieldGet(this, _ColliderBehavior_friction, "f");
    }
    set friction(friction) {
        __classPrivateFieldSet(this, _ColliderBehavior_friction, friction, "f");
        if (this.collider) {
            this.collider.setFriction(friction);
        }
    }
    get restitution() {
        return __classPrivateFieldGet(this, _ColliderBehavior_restitution, "f");
    }
    set restitution(restitution) {
        __classPrivateFieldSet(this, _ColliderBehavior_restitution, restitution, "f");
        if (this.collider) {
            this.collider.setRestitution(restitution);
        }
    }
    constructor(args) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "ColliderBehavior"
        });
        Object.defineProperty(this, "colliderDescriptionConstructor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "colliderDescription", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "handle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasParentRigidBody", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        _ColliderBehavior_mass.set(this, 1);
        _ColliderBehavior_density.set(this, 1);
        _ColliderBehavior_friction.set(this, 0.5);
        _ColliderBehavior_restitution.set(this, 0.5);
        _ColliderBehavior_previousPosition.set(this, new Three.Vector3());
        _ColliderBehavior_previousRotation.set(this, new Three.Quaternion());
        _ColliderBehavior_previousScale.set(this, new Three.Vector3());
        this.addTag(ColliderBehavior);
        this.colliderDescriptionConstructor = args.type;
        if (args.mass)
            __classPrivateFieldSet(this, _ColliderBehavior_mass, args.mass, "f");
        if (args.density)
            __classPrivateFieldSet(this, _ColliderBehavior_density, args.density, "f");
        if (args.friction)
            __classPrivateFieldSet(this, _ColliderBehavior_friction, args.friction, "f");
        if (args.restitution)
            __classPrivateFieldSet(this, _ColliderBehavior_restitution, args.restitution, "f");
    }
    createCollider() {
        if (!this.scene)
            return;
        this.scene.physics?.destroyCollider(this);
        const worldScale = this.parent?.parent?.object3d.getWorldScale(temp.v1) ??
            temp.v1.setScalar(1);
        this.colliderDescription =
            this.colliderDescriptionConstructor(worldScale);
        // todo: add mass and other collider properties here.
        this.colliderDescription.setMass(__classPrivateFieldGet(this, _ColliderBehavior_mass, "f"));
        this.colliderDescription.setDensity(__classPrivateFieldGet(this, _ColliderBehavior_density, "f"));
        this.colliderDescription.setFriction(__classPrivateFieldGet(this, _ColliderBehavior_friction, "f"));
        this.colliderDescription.setRestitution(__classPrivateFieldGet(this, _ColliderBehavior_restitution, "f"));
        this.onCollision &&
            this.colliderDescription.setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS);
        this.onContact &&
            this.colliderDescription.setActiveEvents(Rapier.ActiveEvents.CONTACT_FORCE_EVENTS);
        this.scene.physics.addCollider(this);
    }
    onEnterScene() {
        if (this.collider)
            return;
        this.createCollider();
    }
    onBeforePhysicsUpdate(delta, elapsed) {
        const c = this.collider;
        if (!c)
            return;
        if (__classPrivateFieldGet(this, _ColliderBehavior_previousPosition, "f").equals(this.parent.object3d.position) &&
            __classPrivateFieldGet(this, _ColliderBehavior_previousRotation, "f").equals(this.parent.object3d.quaternion))
            return;
        // if the world scale has changed, we need to recreate the collider.
        if (!__classPrivateFieldGet(this, _ColliderBehavior_previousScale, "f").equals(this.parent.object3d.getWorldScale(temp.v1))) {
            __classPrivateFieldGet(this, _ColliderBehavior_previousScale, "f").copy(temp.v1);
            // need to recreate the collider with the new scale.
        }
        __classPrivateFieldGet(this, _ColliderBehavior_previousPosition, "f").copy(this.parent.object3d.position);
        __classPrivateFieldGet(this, _ColliderBehavior_previousRotation, "f").copy(this.parent.object3d.quaternion);
        if (this.hasParentRigidBody) {
            const parentRigidBody = findAncestorRigidbody(this.parent);
            if (!parentRigidBody || !parentRigidBody.rBody)
                return;
            const rigidBody = parentRigidBody.rBody;
            // Create matrices
            const rbWorldMatrix = temp.m1.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            const parentWorldMatrix = temp.m2.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            const relativeMatrix = temp.m3.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            // Set rigid body's world transform
            rbWorldMatrix.compose(temp.v1.set(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z), temp.q1.set(rigidBody.rotation().x, rigidBody.rotation().y, rigidBody.rotation().z, rigidBody.rotation().w), temp.v2.set(1, 1, 1));
            // Get collider s_Parent's world transform
            this.parent.object3d.updateWorldMatrix(true, false);
            parentWorldMatrix.copy(this.parent.object3d.matrixWorld);
            // Calculate relative transform
            relativeMatrix
                .copy(rbWorldMatrix)
                .invert()
                .multiply(parentWorldMatrix);
            // Extract position and rotation from the relative matrix
            const relativePosition = temp.v3.setScalar(0);
            const relativeQuaternion = temp.q2.set(0, 0, 0, 1);
            const relativeScale = temp.v4.setScalar(1);
            relativeMatrix.decompose(relativePosition, relativeQuaternion, relativeScale);
            // Set collider's position and rotation relative to the s_Parent rigid body
            c.setTranslationWrtParent(relativePosition);
            c.setRotationWrtParent(relativeQuaternion);
        }
        else {
            this.parent.object3d.getWorldPosition(temp.v1);
            this.parent.object3d.getWorldQuaternion(temp.q1);
            c.setTranslation(temp.v1);
            c.setRotation(temp.q1);
        }
    }
    onLeaveScene() {
        this.scene?.physics.destroyCollider(this);
    }
}
_ColliderBehavior_mass = new WeakMap(), _ColliderBehavior_density = new WeakMap(), _ColliderBehavior_friction = new WeakMap(), _ColliderBehavior_restitution = new WeakMap(), _ColliderBehavior_previousPosition = new WeakMap(), _ColliderBehavior_previousRotation = new WeakMap(), _ColliderBehavior_previousScale = new WeakMap();
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
