var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PhysicsWorld_rigidBodies, _PhysicsWorld_colliders, _PhysicsWorld_queue, _PhysicsWorld_debugRenderer;
import * as Three from "three";
import * as Rapier from "@dimforge/rapier3d-compat";
import { s_OnLoad, s_OnStart, s_OnUpdate } from "../Scene/Internal.js";
import { PhysicsDebugRenderer } from "./Debug.js";
import { ASSERT } from "../Core/Asserts.js";
import { Collider } from "./Collider.js";
import { findAncestorRigidbody } from "./FindAncestorRigidbody.js";
import { isActor } from "../Scene/Component.js";
export class PhysicsWorld {
    constructor(args = {}) {
        Object.defineProperty(this, "gravity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "world", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _PhysicsWorld_rigidBodies.set(this, new Map);
        _PhysicsWorld_colliders.set(this, new Map);
        _PhysicsWorld_queue.set(this, void 0);
        _PhysicsWorld_debugRenderer.set(this, void 0);
        this.gravity = args.gravity ?? new Three.Vector3(0, -9.81, 0);
        __classPrivateFieldSet(this, _PhysicsWorld_debugRenderer, new PhysicsDebugRenderer(args.debug), "f");
    }
    addCollider(c) {
        if (__classPrivateFieldGet(this, _PhysicsWorld_colliders, "f").has(c)) {
            this.world.removeCollider(__classPrivateFieldGet(this, _PhysicsWorld_colliders, "f").get(c), true);
        }
        const parent = findAncestorRigidbody(c.parent);
        c.hasParentRigidBody = !!parent;
        const body = parent ? __classPrivateFieldGet(this, _PhysicsWorld_rigidBodies, "f").get(parent) : undefined;
        const desc = c.colliderDescriptionConstructor(c.object3d.getWorldScale(new Three.Vector3()));
        const collider = this.world.createCollider(desc, body);
        collider.setRotation(c.object3d.getWorldQuaternion(temp.q1));
        collider.setTranslation(c.object3d.getWorldPosition(temp.v1));
        collider.setMass(c.mass);
        collider.setDensity(c.density);
        collider.setFriction(c.friction);
        collider.setRestitution(c.restitution);
        __classPrivateFieldGet(this, _PhysicsWorld_colliders, "f").set(c, collider);
    }
    getCollider(c) {
        return __classPrivateFieldGet(this, _PhysicsWorld_colliders, "f").get(c);
    }
    removeCollider(c) {
        const collider = __classPrivateFieldGet(this, _PhysicsWorld_colliders, "f").get(c);
        if (!collider)
            return;
        this.world.removeCollider(collider, true);
        __classPrivateFieldGet(this, _PhysicsWorld_colliders, "f").delete(c);
    }
    addRigidBody(r) {
        ASSERT(r.parent);
        if (__classPrivateFieldGet(this, _PhysicsWorld_rigidBodies, "f").has(r)) {
            this.world.removeRigidBody(__classPrivateFieldGet(this, _PhysicsWorld_rigidBodies, "f").get(r));
        }
        const desc = r.description;
        const body = this.world.createRigidBody(desc);
        __classPrivateFieldGet(this, _PhysicsWorld_rigidBodies, "f").set(r, body);
        r.parent.object3d.getWorldPosition(temp.v1);
        body.setTranslation(temp.v1, true);
        r.parent.object3d.getWorldQuaternion(temp.q1);
        body.setRotation(temp.q1, true);
        const recurseAndRecreateColliders = (actor) => {
            for (const c of actor.components) {
                if (c instanceof Collider)
                    this.addCollider(c);
                if (isActor(c))
                    recurseAndRecreateColliders(c);
            }
        };
        recurseAndRecreateColliders(r.parent);
    }
    getRigidBody(r) {
        return __classPrivateFieldGet(this, _PhysicsWorld_rigidBodies, "f").get(r);
    }
    removeRigidBody(r) {
        const body = __classPrivateFieldGet(this, _PhysicsWorld_rigidBodies, "f").get(r);
        if (!body)
            return;
        this.world.removeRigidBody(body);
        __classPrivateFieldGet(this, _PhysicsWorld_rigidBodies, "f").delete(r);
        const recurseAndRemoveColliders = (actor) => {
            for (const c of actor.components) {
                if (c instanceof Collider)
                    this.removeCollider(c);
                if (isActor(c))
                    recurseAndRemoveColliders(c);
            }
        };
    }
    async [(_PhysicsWorld_rigidBodies = new WeakMap(), _PhysicsWorld_colliders = new WeakMap(), _PhysicsWorld_queue = new WeakMap(), _PhysicsWorld_debugRenderer = new WeakMap(), s_OnLoad)](scene) {
        await Rapier.init();
        __classPrivateFieldSet(this, _PhysicsWorld_queue, new Rapier.EventQueue(false), "f");
        this.world = new Rapier.World(this.gravity);
        this.scene = scene;
    }
    [s_OnStart]() {
        ASSERT(this.world, "PhysicsWorld has not been initialized with a world yet.");
        ASSERT(this.scene, "PhysicsWorld has not been initialized with a scene yet.");
        __classPrivateFieldGet(this, _PhysicsWorld_debugRenderer, "f").start(this.scene.object3d, this.world);
    }
    [s_OnUpdate](d, e) {
        ASSERT(this.world, "PhysicsWorld has not been initialized with a world yet.");
        this.world.timestep = d;
        this.world.step(__classPrivateFieldGet(this, _PhysicsWorld_queue, "f"));
        for (const [actor, body] of __classPrivateFieldGet(this, _PhysicsWorld_rigidBodies, "f")) {
            const transform = temp.v1.copy(body.translation());
            const rotation = temp.q1.copy(body.rotation());
            if (actor.parent) {
                if (actor.parent.parent?.object3d) {
                    // use parent space
                    actor.parent.parent.object3d.worldToLocal(transform);
                    actor.parent.position.copy(transform);
                    actor.parent.parent.object3d.getWorldQuaternion(temp.q2);
                    temp.q2.invert();
                    rotation.premultiply(temp.q2);
                    actor.parent.quaternion.copy(rotation);
                }
                else {
                    actor.parent.object3d.position.copy(transform);
                    actor.parent.object3d.quaternion.copy(rotation);
                }
            }
        }
        __classPrivateFieldGet(this, _PhysicsWorld_queue, "f").drainCollisionEvents((handle1, handle2, started) => {
        });
        __classPrivateFieldGet(this, _PhysicsWorld_queue, "f").drainContactForceEvents((e) => {
        });
        __classPrivateFieldGet(this, _PhysicsWorld_queue, "f").clear();
        __classPrivateFieldGet(this, _PhysicsWorld_debugRenderer, "f").update();
    }
    destructor() {
        // @ts-ignore
        __classPrivateFieldGet(this, _PhysicsWorld_debugRenderer, "f").mesh?.dispose?.();
        __classPrivateFieldGet(this, _PhysicsWorld_debugRenderer, "f").mesh = undefined;
        __classPrivateFieldGet(this, _PhysicsWorld_debugRenderer, "f").world = undefined;
        this.world.free();
    }
}
const temp = {
    v1: new Three.Vector3(),
    v2: new Three.Vector3(),
    v3: new Three.Vector3(),
    q1: new Three.Quaternion(),
    q2: new Three.Quaternion(),
    q3: new Three.Quaternion(),
};
