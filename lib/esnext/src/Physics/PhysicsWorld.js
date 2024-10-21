import * as Three from "three";
import * as Rapier from "@dimforge/rapier3d-compat";
import { s_OnLoad, s_OnStart, s_OnUpdate } from "../Scene/Internal.js";
import { PhysicsDebugRenderer } from "./Debug.js";
import { ASSERT } from "../Core/Asserts.js";
import { Collider } from "./Collider.js";
import { findAncestorRigidbody } from "./FindAncestorRigidbody.js";
import { isActor } from "../Scene/Component.js";
export class PhysicsWorld {
    gravity;
    world;
    scene;
    constructor(args = {}) {
        this.gravity = args.gravity ?? new Three.Vector3(0, -9.81, 0);
        this.#debugRenderer = new PhysicsDebugRenderer(args.debug);
    }
    addCollider(c) {
        if (this.#colliders.has(c)) {
            this.world.removeCollider(this.#colliders.get(c), true);
        }
        const parent = findAncestorRigidbody(c.parent);
        c.hasParentRigidBody = !!parent;
        const body = parent ? this.#rigidBodies.get(parent) : undefined;
        const desc = c.colliderDescriptionConstructor(c.object3d.getWorldScale(new Three.Vector3()));
        const collider = this.world.createCollider(desc, body);
        collider.setRotation(c.object3d.getWorldQuaternion(temp.q1));
        collider.setTranslation(c.object3d.getWorldPosition(temp.v1));
        collider.setMass(c.mass);
        collider.setDensity(c.density);
        collider.setFriction(c.friction);
        collider.setRestitution(c.restitution);
        this.#colliders.set(c, collider);
    }
    getCollider(c) {
        return this.#colliders.get(c);
    }
    removeCollider(c) {
        const collider = this.#colliders.get(c);
        if (!collider)
            return;
        this.world.removeCollider(collider, true);
        this.#colliders.delete(c);
    }
    addRigidBody(r) {
        ASSERT(r.parent);
        if (this.#rigidBodies.has(r)) {
            this.world.removeRigidBody(this.#rigidBodies.get(r));
        }
        const desc = r.description;
        const body = this.world.createRigidBody(desc);
        this.#rigidBodies.set(r, body);
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
        return this.#rigidBodies.get(r);
    }
    removeRigidBody(r) {
        const body = this.#rigidBodies.get(r);
        if (!body)
            return;
        this.world.removeRigidBody(body);
        this.#rigidBodies.delete(r);
        const recurseAndRemoveColliders = (actor) => {
            for (const c of actor.components) {
                if (c instanceof Collider)
                    this.removeCollider(c);
                if (isActor(c))
                    recurseAndRemoveColliders(c);
            }
        };
    }
    async [s_OnLoad](scene) {
        await Rapier.init();
        this.#queue = new Rapier.EventQueue(false);
        this.world = new Rapier.World(this.gravity);
        this.scene = scene;
    }
    [s_OnStart]() {
        ASSERT(this.world, "PhysicsWorld has not been initialized with a world yet.");
        ASSERT(this.scene, "PhysicsWorld has not been initialized with a scene yet.");
        this.#debugRenderer.start(this.scene.object3d, this.world);
    }
    [s_OnUpdate](d, e) {
        ASSERT(this.world, "PhysicsWorld has not been initialized with a world yet.");
        this.world.timestep = d;
        this.world.step(this.#queue);
        for (const [actor, body] of this.#rigidBodies) {
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
        this.#queue.drainCollisionEvents((handle1, handle2, started) => {
        });
        this.#queue.drainContactForceEvents((e) => {
        });
        this.#queue.clear();
        this.#debugRenderer.update();
    }
    destructor() {
        // @ts-ignore
        this.#debugRenderer.mesh?.dispose?.();
        this.#debugRenderer.mesh = undefined;
        this.#debugRenderer.world = undefined;
        this.world.free();
    }
    #rigidBodies = new Map;
    #colliders = new Map;
    #queue;
    #debugRenderer;
}
const temp = {
    v1: new Three.Vector3(),
    v2: new Three.Vector3(),
    v3: new Three.Vector3(),
    q1: new Three.Quaternion(),
    q2: new Three.Quaternion(),
    q3: new Three.Quaternion(),
};
