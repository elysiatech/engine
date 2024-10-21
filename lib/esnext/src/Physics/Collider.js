import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
import Rapier from "@dimforge/rapier3d-compat";
import { findAncestorRigidbody } from "./FindAncestorRigidbody.js";
var ColliderType;
(function (ColliderType) {
    ColliderType[ColliderType["Box"] = 0] = "Box";
    ColliderType[ColliderType["Cylinder"] = 1] = "Cylinder";
    ColliderType[ColliderType["Sphere"] = 2] = "Sphere";
    ColliderType[ColliderType["Cone"] = 3] = "Cone";
    ColliderType[ColliderType["Capsule"] = 4] = "Capsule";
    ColliderType[ColliderType["Mesh"] = 5] = "Mesh";
})(ColliderType || (ColliderType = {}));
export class Collider extends Actor {
    type = "ColliderActor";
    get mass() { return this.#mass; }
    set mass(mass) {
        this.#mass = mass;
        this.scene.physics?.getCollider(this)?.setMass(mass);
    }
    get density() { return this.#density; }
    set density(density) {
        this.#density = density;
        this.scene.physics?.getCollider(this)?.setDensity(density);
    }
    get friction() { return this.#friction; }
    set friction(friction) {
        this.#friction = friction;
        this.scene.physics?.getCollider(this)?.setFriction(friction);
    }
    get restitution() { return this.#restitution; }
    set restitution(restitution) {
        this.#restitution = restitution;
        this.scene.physics?.getCollider(this)?.setRestitution(restitution);
    }
    hasParentRigidBody = false;
    onEnable() {
        this.scene?.physics.addCollider(this);
    }
    onDisable() {
        this.scene?.physics.removeCollider(this);
    }
    onBeforePhysicsUpdate(delta, elapsed) {
        const collider = this.scene.physics.getCollider(this);
        if (!collider)
            return;
        if (this.hasParentRigidBody) {
            const parentRigidBody = findAncestorRigidbody(this);
            if (!parentRigidBody)
                return;
            const rigidBody = this.scene.physics.getRigidBody(parentRigidBody);
            // Create matrices
            if (!rigidBody)
                return;
            temp.m1.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            temp.m2.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            temp.m3.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            // Set rigid body's world transform
            temp.m1.compose(temp.v1.set(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z), temp.q1.set(rigidBody.rotation().x, rigidBody.rotation().y, rigidBody.rotation().z, rigidBody.rotation().w), temp.v2.set(1, 1, 1));
            // Get collider s_Parent's world transform
            this.parent.object3d.updateWorldMatrix(true, false);
            temp.m2.copy(this.parent.object3d.matrixWorld);
            // Calculate relative transform
            temp.m3
                .copy(temp.m1)
                .invert()
                .multiply(temp.m2);
            // Extract position and rotation from the relative matrix
            temp.v3.setScalar(0); // relativePosition
            temp.q2.set(0, 0, 0, 1); // relativeQuaternion
            temp.v4.setScalar(1); // relativeScale
            temp.m3.decompose(temp.v3, // relativePosition
            temp.q2, // relativeQuaternion
            temp.v4);
            // Set collider's position and rotation relative to the s_Parent rigid body
            this.scene.physics.getCollider(this)?.setTranslationWrtParent(temp.v3);
            this.scene.physics.getCollider(this)?.setRotationWrtParent(temp.q2);
        }
        if (!this.#previousScale.equals(roundVec3(this.object3d.getWorldScale(this.#temps), 2))) {
            this.#previousScale.copy(roundVec3(this.object3d.getWorldScale(this.#temps), 2));
            // remake collider because scale changed
            this.scene.physics.addCollider(this);
            return;
        }
        collider.setRotation(this.object3d.getWorldQuaternion(this.#tempq));
        collider.setTranslation(this.object3d.getWorldPosition(this.#tempv));
    }
    #mass = 1;
    #density = 1;
    #friction = 0.5;
    #restitution = 0.5;
    #previousScale = new Three.Vector3();
    #tempq = new Three.Quaternion();
    #tempv = new Three.Vector3();
    #temps = new Three.Vector3();
}
export class BoxCollider extends Collider {
    colliderType = ColliderType.Box;
    colliderDescriptionConstructor(worldScale) {
        return Rapier.ColliderDesc.cuboid(worldScale.x / 2, worldScale.y / 2, worldScale.z / 2);
    }
}
export class CylinderCollider extends Collider {
    height;
    radius;
    colliderType = ColliderType.Cylinder;
    constructor(height, radius) {
        super();
        this.height = height;
        this.radius = radius;
    }
    colliderDescriptionConstructor() {
        return Rapier.ColliderDesc.cylinder(this.height / 2, this.radius);
    }
}
export class SphereCollider extends Collider {
    radius;
    colliderType = ColliderType.Sphere;
    constructor(radius) {
        super();
        this.radius = radius;
    }
    colliderDescriptionConstructor() {
        return Rapier.ColliderDesc.ball(this.radius);
    }
}
export class ConeCollider extends Collider {
    height;
    radius;
    colliderType = ColliderType.Cone;
    constructor(height, radius) {
        super();
        this.height = height;
        this.radius = radius;
    }
    colliderDescriptionConstructor() {
        return Rapier.ColliderDesc.cone(this.height / 2, this.radius);
    }
}
export class CapsuleCollider extends Collider {
    height;
    radius;
    colliderType = ColliderType.Capsule;
    constructor(height, radius) {
        super();
        this.height = height;
        this.radius = radius;
    }
    colliderDescriptionConstructor() {
        return Rapier.ColliderDesc.capsule(this.height / 2, this.radius);
    }
}
export class MeshCollider extends Collider {
    points;
    colliderType = ColliderType.Mesh;
    constructor(points) {
        super();
        this.points = points;
    }
    colliderDescriptionConstructor() {
        const worldScale = this.object3d.getWorldScale(new Three.Vector3());
        let vertices;
        if (this.points instanceof Float32Array) {
            vertices = this.points.slice(); // Create a copy to avoid modifying the original
        }
        else {
            vertices = this.points.getAttribute("position").array.slice();
        }
        // Scale each vertex
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i] *= worldScale.x;
            vertices[i + 1] *= worldScale.y;
            vertices[i + 2] *= worldScale.z;
        }
        return Rapier.ColliderDesc.convexHull(vertices);
    }
}
const roundVec3 = (v, decimals) => v.set(Math.round(v.x * decimals) / decimals, Math.round(v.y * decimals) / decimals, Math.round(v.z * decimals) / decimals);
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
