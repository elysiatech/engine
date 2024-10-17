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
var _PhysicsController_debugRenderer;
import { Root } from "../Scene/Scene.js";
import * as Three from "three";
import Rapier from '@dimforge/rapier3d-compat';
import { PhysicsDebugRenderer } from "./Debug.js";
import { ASSERT } from "../Core/Asserts.js";
import { isActor } from "../Scene/Component.js";
import { findAncestorRigidbody } from "./FindAncestorRigidbody.js";
import { OnBeforePhysicsUpdate } from "../Core/Internal.js";
const temp = {
    v1: new Three.Vector3(),
    v2: new Three.Vector3(),
    v3: new Three.Vector3(),
    q1: new Three.Quaternion(),
    q2: new Three.Quaternion(),
    q3: new Three.Quaternion(),
};
export class PhysicsController {
    get debug() { return __classPrivateFieldGet(this, _PhysicsController_debugRenderer, "f").enabled; }
    set debug(value) { __classPrivateFieldGet(this, _PhysicsController_debugRenderer, "f").enabled = value; }
    constructor(args = {}) {
        Object.defineProperty(this, "world", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gravity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "colliders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map
        });
        Object.defineProperty(this, "rigidBodies", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map
        });
        Object.defineProperty(this, "characterControllers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _PhysicsController_debugRenderer.set(this, void 0);
        this.init = this.init.bind(this);
        this.updatePhysicsWorld = this.updatePhysicsWorld.bind(this);
        this.gravity = args.gravity ?? new Three.Vector3(0, -9.81, 0);
        __classPrivateFieldSet(this, _PhysicsController_debugRenderer, new PhysicsDebugRenderer(args.debug), "f");
    }
    async init(scene) {
        await Rapier.init();
        this.queue = new Rapier.EventQueue(false);
        this.world = new Rapier.World(this.gravity);
        this.scene = scene;
    }
    start() {
        ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
        ASSERT(this.scene, "PhysicsController has not been initialized with a scene yet.");
        __classPrivateFieldGet(this, _PhysicsController_debugRenderer, "f").start(this.scene.object3d, this.world);
    }
    addCollider(collider) {
        ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
        ASSERT(collider.parent, "ColliderBehavior has no parent.");
        const parent = findAncestorRigidbody(collider.parent);
        if (collider.collider) {
            this.world.removeCollider(collider.collider, true);
        }
        if (!collider.colliderDescription)
            return;
        collider.handle = this.world?.createCollider(collider.colliderDescription, parent?.rBody).handle;
        collider.hasParentRigidBody = !!parent?.rBody;
        this.colliders.set(collider.handle, { component: collider });
    }
    getCollider(handle) {
        if (typeof handle === "undefined")
            return undefined;
        return this.world?.getCollider(handle);
    }
    destroyCollider(collider) {
        const c = collider.collider;
        if (!c)
            return;
        this.world.removeCollider(c, true);
        this.colliders.delete(c.handle);
    }
    addRigidBody(rigidBody) {
        ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
        ASSERT(rigidBody.parent, "RigidBodyBehavior has no parent.");
        rigidBody.handle = this.world?.createRigidBody(rigidBody.rbodyDescription).handle;
        rigidBody.parent.object3d.getWorldPosition(temp.v1);
        const rBody = this.world.getRigidBody(rigidBody.handle);
        rBody.setTranslation(temp.v1, true);
        rigidBody.parent.object3d.getWorldQuaternion(temp.q1);
        rBody.setRotation(temp.q1, true);
        this.rigidBodies.set(rigidBody.handle, { component: rigidBody });
        const recurseAndRecreateColliders = (actor) => {
            for (const c of actor.components) {
                if (c.type === "ColliderBehavior") {
                    this.destroyCollider(c);
                    this.addCollider(c);
                }
                if (isActor(c))
                    recurseAndRecreateColliders(c);
            }
        };
        recurseAndRecreateColliders(rigidBody.parent);
    }
    getRigidBody(handle) {
        if (typeof handle === "undefined")
            return undefined;
        return this.world?.getRigidBody(handle);
    }
    destroyRigidBody(rigidBody) {
        if (!rigidBody.rBody)
            return;
        this.world?.removeRigidBody(rigidBody.rBody);
        this.rigidBodies.delete(rigidBody.handle ?? 0);
        const recurseAndDestroyColliders = (actor) => {
            for (const c of actor.components) {
                if (c.type === "ColliderBehavior") {
                    c.hasParentRigidBody = false;
                    this.destroyCollider(c);
                    this.addCollider(c);
                }
                if (isActor(c))
                    recurseAndDestroyColliders(c);
            }
        };
    }
    addCharacterController(args) {
        ASSERT(this.world, "PhysicsController has not been initialized with a world yet.");
        const player = this.world?.createCharacterController(0.01);
        const uuid = Three.MathUtils.generateUUID();
        this.characterControllers.set(uuid, { instance: player });
        return uuid;
    }
    getCharacterController(handle) {
        if (!handle)
            return undefined;
        return this.characterControllers.get(handle)?.instance;
    }
    destroyCharacterController(handle) {
        if (!handle)
            return;
        const player = this.characterControllers.get(handle)?.instance;
        this.characterControllers.delete(handle);
        if (player && this.world)
            this.world.removeCharacterController(player);
    }
    updatePhysicsWorld(scene, delta, elapsed) {
        if (!this.world)
            return;
        this.scene?.[Root][OnBeforePhysicsUpdate](delta, elapsed);
        this.world.timestep = delta;
        this.world.step(this.queue);
        // sync the rigid bodies with the world
        for (const r of this.rigidBodies) {
            const body = this.world.getRigidBody(r[0]);
            if (!body)
                continue;
            // world space location of the rigid body
            const transform = temp.v1.copy(body.translation());
            const rotation = temp.q1.copy(body.rotation());
            if (r[1].component.parent) {
                if (r[1].component.parent.parent?.object3d) {
                    // use parent space
                    r[1].component.parent.parent.object3d.worldToLocal(transform);
                    r[1].component.parent.position.copy(transform);
                    r[1].component.parent.parent.object3d.getWorldQuaternion(temp.q2);
                    temp.q2.invert();
                    rotation.premultiply(temp.q2);
                    r[1].component.parent.quaternion.copy(rotation);
                }
                else {
                    // we are at the root, using worldspace
                    r[1].component.parent.object3d.position.copy(transform);
                    r[1].component.parent.object3d.quaternion.copy(rotation);
                }
            }
        }
        this.queue.drainCollisionEvents((handle1, handle2, started) => {
            const c1 = this.colliders.get(handle1);
            const c2 = this.colliders.get(handle2);
            if (!c1 || !c2)
                return;
            c1.component.onCollision?.(c2.component, started);
            c2.component.onCollision?.(c1.component, started);
        });
        this.queue.drainContactForceEvents((e) => {
            const c1 = this.colliders.get(e.collider1());
            const c2 = this.colliders.get(e.collider2());
            if (!c1 || !c2)
                return;
            c1.component.onContact?.(c2.component, e.maxForceDirection(), e.maxForceMagnitude(), e.totalForce(), e.totalForceMagnitude());
            c2.component.onContact?.(c2.component, e.maxForceDirection(), e.maxForceMagnitude(), e.totalForce(), e.totalForceMagnitude());
        });
        this.queue.clear();
        __classPrivateFieldGet(this, _PhysicsController_debugRenderer, "f").update();
    }
    destructor() { }
}
_PhysicsController_debugRenderer = new WeakMap();
