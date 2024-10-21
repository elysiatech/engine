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
    type = "RigidBody";
    description;
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
        return this.scene?.physics?.getRigidBody(this)?.linvel() ?? this.#linearVelocity;
    }
    set linearVelocity(velocity) {
        this.#linearVelocity = velocity;
        this.scene?.physics?.getRigidBody(this)?.setLinvel(velocity, true);
    }
    get angularVelocity() {
        return this.scene?.physics?.getRigidBody(this)?.angvel() ?? this.#angularVelocity;
    }
    set angularVelocity(velocity) {
        this.#angularVelocity = velocity;
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
        this.#rigidBodyType = type;
        this.description = new Rapier.RigidBodyDesc(this.#rigidBodyType === RigidbodyType.Static
            ? Rapier.RigidBodyType.Fixed
            : this.#rigidBodyType === RigidbodyType.Dynamic
                ? Rapier.RigidBodyType.Dynamic
                : this.#rigidBodyType === RigidbodyType.KinematicVelocity
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
    #rigidBodyType = RigidbodyType.Dynamic;
    #linearVelocity = { x: 0, y: 0, z: 0 };
    #angularVelocity = { x: 0, y: 0, z: 0 };
}
