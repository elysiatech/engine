import { Behavior } from "../Scene/Behavior";
import Rapier from "@dimforge/rapier3d-compat";
import { ASSERT } from "../Core/Asserts";
import * as Three from "three";
const temp = {
    vec3: new Three.Vector3,
};
export class RigidBodyBehavior extends Behavior {
    type = "RigidBodyBehavior";
    handle;
    get rBody() { return this.scene?.physics?.getRigidBody(this.handle); }
    ;
    rbodyType;
    rbodyDescription;
    get mass() { return this.rBody ? this.rBody.mass() : this.rbodyDescription.mass; }
    get linvel() { return this.rBody ? this.rBody.linvel() : this.rbodyDescription.linvel; }
    get angvel() { return this.rBody ? this.rBody.angvel() : this.rbodyDescription.angvel; }
    get linDamping() { return this.rBody ? this.rBody.linearDamping() : this.rbodyDescription.linearDamping; }
    get angDamping() { return this.rBody ? this.rBody.angularDamping() : this.rbodyDescription.angularDamping; }
    get ccdEnabled() { return this.rBody ? this.rBody.isCcdEnabled() : this.rbodyDescription.ccdEnabled; }
    constructor(args) {
        super();
        this.rbodyType = args.type ?? Rapier.RigidBodyType.Dynamic;
        this.rbodyDescription = new Rapier.RigidBodyDesc(this.rbodyType);
    }
    onEnterScene() {
        ASSERT(this.scene?.physics, "PhysicsController has not been initialized with a world yet.");
        this.scene?.physics?.addRigidBody(this);
        this.rBody.addForce(this.forceToApply, true);
        this.forceToApply.set(0, 0, 0);
        this.rBody.addTorque(this.torqueToApply, true);
        this.torqueToApply.set(0, 0, 0);
        this.rBody.applyImpulse(this.impulseToApply, true);
        this.impulseToApply.set(0, 0, 0);
    }
    setAdditionalMass(mass) {
        if (this.rBody)
            this.rBody.setAdditionalMass(mass, true);
        this.rbodyDescription.setAdditionalMass(mass);
    }
    setLinearVelocity(velocity) {
        if (this.rBody)
            this.rBody.setLinvel(velocity, true);
        this.rbodyDescription.setLinvel(velocity.x, velocity.y, velocity.z);
    }
    setAngularVelocity(velocity) {
        if (this.rBody)
            this.rBody.setAngvel(velocity, true);
        this.rbodyDescription.setAngvel(velocity);
    }
    setLinearDamping(damping) {
        if (this.rBody)
            this.rBody.setLinearDamping(damping);
        this.rbodyDescription.setLinearDamping(damping);
    }
    setAngularDamping(damping) {
        if (this.rBody)
            this.rBody.setAngularDamping(damping);
        this.rbodyDescription.setAngularDamping(damping);
    }
    resetForces() { if (this.rBody)
        this.rBody.resetForces(true); }
    resetTorques() { if (this.rBody)
        this.rBody.resetTorques(true); }
    addForce(force) {
        if (this.rBody)
            this.rBody.addForce(force, true);
        else
            this.forceToApply.set(force.x, force.y, force.z);
    }
    addTorque(torque) {
        if (this.rBody)
            this.rBody.addTorque(torque, true);
        else
            this.torqueToApply.set(torque.x, torque.y, torque.z);
    }
    ;
    applyTorqueImpulse(impulse) { if (this.rBody)
        this.rBody.applyTorqueImpulse(impulse, true); }
    ;
    addForceAtPoint(force, point) { if (this.rBody)
        this.rBody.addForceAtPoint(force, point, true); }
    ;
    applyImpulse(impulse) {
        if (this.rBody)
            this.rBody.applyImpulse(impulse, true);
        else
            this.impulseToApply.set(impulse.x, impulse.y, impulse.z);
    }
    ;
    applyImpulseAtPoint(impulse, point) { if (this.rBody)
        this.rBody.applyImpulseAtPoint(impulse, point, true); }
    ;
    lockTranslation(x, y, z) {
        if (this.rBody)
            this.rBody.setEnabledTranslations(x, y, z, true);
        this.rbodyDescription.enabledTranslations(x, y, z);
    }
    lockRotation(x, y, z) {
        if (this.rBody)
            this.rBody.setEnabledRotations(x, y, z, true);
        this.rbodyDescription.enabledRotations(x, y, z);
    }
    enableContinuousCollisionDetection(cond) {
        if (this.rBody)
            this.rBody.enableCcd(cond);
        this.rbodyDescription.setCcdEnabled(cond);
    }
    onLeaveScene() { this.scene?.physics?.destroyRigidBody(this); }
    forceToApply = new Three.Vector3;
    torqueToApply = new Three.Vector3;
    impulseToApply = new Three.Vector3;
}
