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
var _RigidBody_rigidBodyType, _RigidBody_linearVelocity, _RigidBody_angularVelocity;
import { Behavior } from "../Scene/Behavior.js";
import * as Rapier from "@dimforge/rapier3d-compat";
export var RigidbodyType;
(function (RigidbodyType) {
    RigidbodyType[RigidbodyType["Static"] = 0] = "Static";
    RigidbodyType[RigidbodyType["Dynamic"] = 1] = "Dynamic";
    RigidbodyType[RigidbodyType["KinematicVelocity"] = 2] = "KinematicVelocity";
    RigidbodyType[RigidbodyType["KinematicPosition"] = 3] = "KinematicPosition";
})(RigidbodyType || (RigidbodyType = {}));
export class RigidBody extends Behavior {
    get mass() {
        return this.scene?.physics?.getRigidBody(this)?.mass() ?? this.description.mass;
    }
    set mass(mass) {
        this.description.setAdditionalMass(mass);
        this.scene?.physics?.getRigidBody(this)?.setAdditionalMass(mass, true);
    }
    get linearDamping() {
        return this.scene?.physics?.getRigidBody(this)?.linearDamping() ?? this.description.linearDamping;
    }
    set linearDamping(damping) {
        this.description.setLinearDamping(damping);
        this.scene?.physics?.getRigidBody(this)?.setLinearDamping(damping);
    }
    get angularDamping() {
        return this.scene?.physics?.getRigidBody(this)?.angularDamping() ?? this.description.angularDamping;
    }
    set angularDamping(damping) {
        this.description.setAngularDamping(damping);
        this.scene?.physics?.getRigidBody(this)?.setAngularDamping(damping);
    }
    get linearVelocity() {
        return this.scene?.physics?.getRigidBody(this)?.linvel() ?? __classPrivateFieldGet(this, _RigidBody_linearVelocity, "f");
    }
    set linearVelocity(velocity) {
        __classPrivateFieldSet(this, _RigidBody_linearVelocity, velocity, "f");
        this.scene?.physics?.getRigidBody(this)?.setLinvel(velocity, true);
    }
    get angularVelocity() {
        return this.scene?.physics?.getRigidBody(this)?.angvel() ?? __classPrivateFieldGet(this, _RigidBody_angularVelocity, "f");
    }
    set angularVelocity(velocity) {
        __classPrivateFieldSet(this, _RigidBody_angularVelocity, velocity, "f");
        this.scene.physics?.getRigidBody(this)?.setAngvel(velocity, true);
    }
    get ccdEnabled() {
        return this.scene?.physics?.getRigidBody(this)?.isCcdEnabled() ?? this.description.ccdEnabled;
    }
    set ccdEnabled(enabled) {
        this.description.setCcdEnabled(enabled);
        this.scene?.physics?.getRigidBody(this)?.enableCcd(enabled);
    }
    constructor(type) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "RigidBody"
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _RigidBody_rigidBodyType.set(this, RigidbodyType.Dynamic);
        _RigidBody_linearVelocity.set(this, { x: 0, y: 0, z: 0 });
        _RigidBody_angularVelocity.set(this, { x: 0, y: 0, z: 0 });
        __classPrivateFieldSet(this, _RigidBody_rigidBodyType, type, "f");
        this.description = new Rapier.RigidBodyDesc(__classPrivateFieldGet(this, _RigidBody_rigidBodyType, "f") === RigidbodyType.Static
            ? Rapier.RigidBodyType.Fixed
            : __classPrivateFieldGet(this, _RigidBody_rigidBodyType, "f") === RigidbodyType.Dynamic
                ? Rapier.RigidBodyType.Dynamic
                : __classPrivateFieldGet(this, _RigidBody_rigidBodyType, "f") === RigidbodyType.KinematicVelocity
                    ? Rapier.RigidBodyType.KinematicVelocityBased
                    : Rapier.RigidBodyType.KinematicPositionBased);
    }
    onEnable() {
        this.scene.physics?.addRigidBody(this);
    }
    onDisable() {
        this.scene.physics?.removeRigidBody(this);
    }
    applyImpulse(impulse) {
        this.scene?.physics?.getRigidBody(this)?.applyImpulse(impulse, true);
    }
    applyForce(force) {
        this.scene?.physics?.getRigidBody(this)?.addForce(force, true);
    }
    applyTorque(torque) {
        this.scene?.physics?.getRigidBody(this)?.addTorque(torque, true);
    }
}
_RigidBody_rigidBodyType = new WeakMap(), _RigidBody_linearVelocity = new WeakMap(), _RigidBody_angularVelocity = new WeakMap();
