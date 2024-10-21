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
var _Collider_mass, _Collider_density, _Collider_friction, _Collider_restitution, _Collider_previousScale, _Collider_tempq, _Collider_tempv, _Collider_temps;
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
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "ColliderActor"
        });
        Object.defineProperty(this, "hasParentRigidBody", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        _Collider_mass.set(this, 1);
        _Collider_density.set(this, 1);
        _Collider_friction.set(this, 0.5);
        _Collider_restitution.set(this, 0.5);
        _Collider_previousScale.set(this, new Three.Vector3());
        _Collider_tempq.set(this, new Three.Quaternion());
        _Collider_tempv.set(this, new Three.Vector3());
        _Collider_temps.set(this, new Three.Vector3());
    }
    get mass() { return __classPrivateFieldGet(this, _Collider_mass, "f"); }
    set mass(mass) {
        __classPrivateFieldSet(this, _Collider_mass, mass, "f");
        this.scene.physics?.getCollider(this)?.setMass(mass);
    }
    get density() { return __classPrivateFieldGet(this, _Collider_density, "f"); }
    set density(density) {
        __classPrivateFieldSet(this, _Collider_density, density, "f");
        this.scene.physics?.getCollider(this)?.setDensity(density);
    }
    get friction() { return __classPrivateFieldGet(this, _Collider_friction, "f"); }
    set friction(friction) {
        __classPrivateFieldSet(this, _Collider_friction, friction, "f");
        this.scene.physics?.getCollider(this)?.setFriction(friction);
    }
    get restitution() { return __classPrivateFieldGet(this, _Collider_restitution, "f"); }
    set restitution(restitution) {
        __classPrivateFieldSet(this, _Collider_restitution, restitution, "f");
        this.scene.physics?.getCollider(this)?.setRestitution(restitution);
    }
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
        if (!__classPrivateFieldGet(this, _Collider_previousScale, "f").equals(roundVec3(this.object3d.getWorldScale(__classPrivateFieldGet(this, _Collider_temps, "f")), 2))) {
            __classPrivateFieldGet(this, _Collider_previousScale, "f").copy(roundVec3(this.object3d.getWorldScale(__classPrivateFieldGet(this, _Collider_temps, "f")), 2));
            // remake collider because scale changed
            this.scene.physics.addCollider(this);
            return;
        }
        collider.setRotation(this.object3d.getWorldQuaternion(__classPrivateFieldGet(this, _Collider_tempq, "f")));
        collider.setTranslation(this.object3d.getWorldPosition(__classPrivateFieldGet(this, _Collider_tempv, "f")));
    }
}
_Collider_mass = new WeakMap(), _Collider_density = new WeakMap(), _Collider_friction = new WeakMap(), _Collider_restitution = new WeakMap(), _Collider_previousScale = new WeakMap(), _Collider_tempq = new WeakMap(), _Collider_tempv = new WeakMap(), _Collider_temps = new WeakMap();
export class BoxCollider extends Collider {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "colliderType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ColliderType.Box
        });
    }
    colliderDescriptionConstructor(worldScale) {
        return Rapier.ColliderDesc.cuboid(worldScale.x / 2, worldScale.y / 2, worldScale.z / 2);
    }
}
export class CylinderCollider extends Collider {
    constructor(height, radius) {
        super();
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: height
        });
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radius
        });
        Object.defineProperty(this, "colliderType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ColliderType.Cylinder
        });
    }
    colliderDescriptionConstructor() {
        return Rapier.ColliderDesc.cylinder(this.height / 2, this.radius);
    }
}
export class SphereCollider extends Collider {
    constructor(radius) {
        super();
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radius
        });
        Object.defineProperty(this, "colliderType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ColliderType.Sphere
        });
    }
    colliderDescriptionConstructor() {
        return Rapier.ColliderDesc.ball(this.radius);
    }
}
export class ConeCollider extends Collider {
    constructor(height, radius) {
        super();
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: height
        });
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radius
        });
        Object.defineProperty(this, "colliderType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ColliderType.Cone
        });
    }
    colliderDescriptionConstructor() {
        return Rapier.ColliderDesc.cone(this.height / 2, this.radius);
    }
}
export class CapsuleCollider extends Collider {
    constructor(height, radius) {
        super();
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: height
        });
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radius
        });
        Object.defineProperty(this, "colliderType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ColliderType.Capsule
        });
    }
    colliderDescriptionConstructor() {
        return Rapier.ColliderDesc.capsule(this.height / 2, this.radius);
    }
}
export class MeshCollider extends Collider {
    constructor(points) {
        super();
        Object.defineProperty(this, "points", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: points
        });
        Object.defineProperty(this, "colliderType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ColliderType.Mesh
        });
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
