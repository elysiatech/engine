var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
import * as Three from "three";
import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent } from "../Core/ElysiaEvents.js";
import { isActor } from "./Component.js";
import { isDev } from "../Core/Asserts.js";
import { ComponentSet } from "../Containers/ComponentSet.js";
import { s_App, s_Created, s_Destroyed, s_Enabled, s_InScene, s_Internal, s_Object3D, s_OnBeforePhysicsUpdate, s_OnCreate, s_OnDestroy, s_OnDisable, s_OnEnable, s_OnEnterScene, s_OnLeaveScene, s_OnReparent, s_OnResize, s_OnStart, s_OnUpdate, s_Parent, s_Scene, s_Started } from "./Internal.js";
import { reportLifecycleError } from "./Errors.js";
// internal symbols
export const IsActor = Symbol.for("Elysia::IsActor");
export const s_ComponentsByType = Symbol("Elysia::Actor::ComponentsByType");
export const s_ComponentsByTag = Symbol("Elysia::Actor::ComponentsByTag");
export class Actor {
    constructor() {
        Object.defineProperty(this, _a, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Actor"
        });
        /** The child components of this actor. */
        Object.defineProperty(this, "components", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set
        });
        /** The tags of this actor. */
        Object.defineProperty(this, "tags", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set
        });
        /* **********************************************************
            s_Internal
        ************************************************************/
        Object.defineProperty(this, _b, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ((e) => (e.actor = this, e))(new Three.Object3D)
        });
        Object.defineProperty(this, _c, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, _d, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, _e, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, _f, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, _g, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, _h, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, _j, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { _enabled: false }
        });
        Object.defineProperty(this, _k, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, _l, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, _m, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, _o, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    /**
     * The underlying Three.js object.
     * This should be used with caution, as it can break the internal state of the actor in some cases.
     */
    get object3d() { return this[s_Object3D]; }
    set object3d(object3d) { this.updateObject3d(object3d); }
    /** Whether this actor has finished it's onCreate() lifecycle. */
    get created() { return this[s_Created]; }
    /** If the actor is enabled. */
    get enabled() { return this[s_Enabled]; }
    /** Whether this actor has finished it's onStart() lifecycle. */
    get started() { return this[s_Started]; }
    /** Whether this actor is in the scene. */
    get inScene() { return this[s_InScene]; }
    /** Whether this actor is destroyed */
    get destroyed() { return this[s_Destroyed]; }
    /** The Application instance of this actor. */
    get app() { return this[s_App]; }
    /** The Scene instance of this actor. */
    get scene() { return this[s_Scene]; }
    /** The parent actor of this actor. */
    get parent() { return this[s_Parent]; }
    /** The position of this actor. */
    get position() { return this[s_Object3D].position; }
    set position(position) { this[s_Object3D].position.copy(position); }
    /** The rotation of this actor. */
    get rotation() { return this[s_Object3D].rotation; }
    set rotation(rotation) { this[s_Object3D].rotation.copy(rotation); }
    /** The scale of this actor. */
    get scale() { return this[s_Object3D].scale; }
    set scale(scale) { this[s_Object3D].scale.copy(scale); }
    /** The quaternion of this actor. */
    get quaternion() { return this[s_Object3D].quaternion; }
    set quaternion(quaternion) { this[s_Object3D].quaternion.copy(quaternion); }
    /* **********************************************************
        Lifecycle methods
    ************************************************************/
    onCreate() { }
    onEnable() { }
    onStart() { }
    onEnterScene() { }
    onBeforePhysicsUpdate(delta, elapsed) { }
    onUpdate(delta, elapsed) { }
    onLeaveScene() { }
    onDisable() { }
    onDestroy() { }
    onReparent(parent) { }
    onResize(width, height) { }
    /* **********************************************************
        Public methods
    ************************************************************/
    updateObject3d(newObject3d) {
        if (this[s_Object3D] === newObject3d)
            return;
        const parent = this[s_Object3D].parent;
        this[s_Object3D].parent?.remove(this[s_Object3D]);
        this[s_Object3D].actor = undefined;
        // set this actor as the actor of the s_Object3D
        newObject3d.actor = this;
        this[s_Object3D] = newObject3d;
        if (!newObject3d.hasElysiaEvents) {
            newObject3d.addEventListener("added", (e) => {
                newObject3d.actor?.[s_OnEnterScene]();
            });
            newObject3d.addEventListener("removed", (e) => {
                newObject3d.actor?.[s_OnLeaveScene]();
            });
            newObject3d.hasElysiaEvents = true;
        }
        if (parent) {
            parent.add(newObject3d);
        }
    }
    /**
     * Enables this actor. This means it receives updates and is visible.
     */
    enable() { this[s_OnEnable](true); }
    /**
     * Disables this actor. This means it does not receive updates and is not visible.
     */
    disable() { this[s_OnDisable](); }
    /**
     * Adds a tag to this actor.
     * @param tag
     */
    addTag(tag) {
        ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
        this.tags.add(tag);
    }
    /**
     * Removes a tag from this actor.
     * @param tag
     */
    removeTag(tag) {
        ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
        this.tags.delete(tag);
    }
    /**
     * Adds a component to this actor.
     * @param component
     * @returns `true` if the component was successfully added, `false` otherwise.
     */
    addComponent(component) {
        if (this[s_Destroyed]) {
            ELYSIA_LOGGER.warn("Trying to add component to a destroyed actor");
            return false;
        }
        if (component.destroyed) {
            ELYSIA_LOGGER.warn("Trying to add destroyed component to actor");
            return false;
        }
        this.components.add(component);
        if (!this[s_ComponentsByType].has(component.constructor)) {
            this[s_ComponentsByType].set(component.constructor, new ComponentSet);
        }
        this[s_ComponentsByType].get(component.constructor).add(component);
        if (isActor(component)) {
            for (const tag of component.tags) {
                if (!this[s_ComponentsByTag].has(tag)) {
                    this[s_ComponentsByTag].set(tag, new ComponentSet);
                }
                this[s_ComponentsByTag].get(tag).add(component);
            }
        }
        ElysiaEventDispatcher.dispatchEvent(new ComponentAddedEvent({ parent: this, child: component }));
        component[s_Parent] = this;
        component[s_Scene] = this[s_Scene];
        component[s_App] = this[s_App];
        if (this[s_Created])
            component[s_OnCreate]();
        if (this[s_InScene]) {
            if (isActor(component))
                this.object3d.add(component.object3d);
            component[s_OnEnterScene]();
        }
        if (this[s_InScene] && this[s_Enabled])
            component[s_OnEnable]();
        return true;
    }
    /**
     * Removes a component from this actor.
     * @param component
     * @returns `true` if the component was successfully removed, `false` otherwise.
     */
    removeComponent(component) {
        if (this[s_Destroyed]) {
            ELYSIA_LOGGER.warn("Trying to remove component from a destroyed actor");
            return false;
        }
        if (component.destroyed) {
            ELYSIA_LOGGER.warn("Trying to remove destroyed component from actor");
            return false;
        }
        ElysiaEventDispatcher.dispatchEvent(new ComponentRemovedEvent({ parent: this, child: component }));
        this.components.delete(component);
        this[s_ComponentsByType].get(component.constructor)?.delete(component);
        if (isActor(component)) {
            for (const tag of component.tags) {
                this[s_ComponentsByTag].get(tag)?.delete(component);
            }
        }
        component[s_OnLeaveScene]();
        isActor(component) && this.object3d.remove(component.object3d);
        component[s_OnDisable]();
        return true;
    }
    /**
     * Gets all components of a certain type directly attached to this actor.
     */
    getComponentsByType(type) {
        const set = this[s_ComponentsByType].get(type);
        if (!set) {
            const newSet = new ComponentSet;
            (this[s_ComponentsByType].set(type, newSet));
            return newSet;
        }
        else
            return set;
    }
    /**
     * Gets all components with a certain tag directly attached to this actor.
     */
    getComponentsByTag(tag) {
        const set = this[s_ComponentsByTag].get(tag);
        if (!set) {
            const newSet = new ComponentSet;
            (this[s_ComponentsByTag].set(tag, newSet));
            return newSet;
        }
        else
            return set;
    }
    /**
     * Destroys this actor and all its components.
     * Recursively destroys all children actors, starting from the deepest children.
     */
    destructor() {
        if (this[s_Destroyed])
            return;
        for (const component of this.components) {
            component.destructor();
        }
        this[s_OnDisable]();
        this[s_Parent]?.removeComponent(this);
        this[s_OnDestroy]();
        this[s_Object3D].actor = undefined;
        this[s_Object3D].parent?.remove(this[s_Object3D]);
        this[s_Parent] = null;
        this[s_Scene] = null;
        this[s_App] = null;
        this[s_Destroyed] = true;
    }
    [(_a = IsActor, _b = s_Object3D, _c = s_Parent, _d = s_Scene, _e = s_App, _f = s_Created, _g = s_Started, _h = s_Enabled, _j = s_Internal, _k = s_InScene, _l = s_Destroyed, _m = s_ComponentsByType, _o = s_ComponentsByTag, s_OnEnable)](force = false) {
        if (!force && !this[s_Enabled])
            return;
        if (this[s_Internal]._enabled || this[s_Destroyed])
            return;
        this[s_Enabled] = true;
        this[s_Internal]._enabled = true;
        this.object3d.visible = true;
        reportLifecycleError(this, this.onEnable);
        for (const component of this.components) {
            component[s_OnEnable]();
        }
    }
    [s_OnDisable]() {
        if (!this[s_Enabled] || this[s_Destroyed])
            return;
        this[s_Enabled] = false;
        this[s_Internal]._enabled = false;
        this.object3d.visible = false;
        reportLifecycleError(this, this.onDisable);
        for (const component of this.components) {
            component[s_OnDisable]();
        }
    }
    [s_OnCreate]() {
        if (this[s_Created])
            return;
        if (this[s_Destroyed]) {
            ELYSIA_LOGGER.warn(`Trying to create a destroyed actor: ${this}`);
            return;
        }
        reportLifecycleError(this, this.onCreate);
        this.app.renderPipeline.getRenderer().getSize(tempVec2);
        this[s_OnResize](tempVec2.x, tempVec2.y);
        this[s_Created] = true;
        for (const component of this.components) {
            component[s_App] = this.app;
            component[s_Scene] = this.scene;
            component[s_Parent] = this;
            if (!component.created)
                component[s_OnCreate]();
        }
    }
    [s_OnEnterScene]() {
        if (this[s_InScene] || !this[s_Created])
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn(`Trying to add a destroyed actor to scene: ${this}`);
            return;
        }
        reportLifecycleError(this, this.onEnterScene);
        this[s_InScene] = true;
        for (const component of this.components) {
            if (isActor(component))
                this.object3d.add(component.object3d);
            component[s_OnEnterScene]();
        }
    }
    [s_OnStart]() {
        if (this[s_Started])
            return;
        if (!this[s_InScene] || !this.enabled)
            return;
        if (this[s_Destroyed]) {
            ELYSIA_LOGGER.warn(`Trying to start a destroyed actor: ${this}`);
            return;
        }
        reportLifecycleError(this, this.onStart);
        this[s_Started] = true;
        for (const component of this.components) {
            if (!component.started)
                component[s_OnStart]();
        }
    }
    [s_OnBeforePhysicsUpdate](delta, elapsed) {
        if (!this[s_Enabled] || !this[s_InScene])
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
            return;
        }
        if (!this[s_Started])
            this[s_OnStart]();
        reportLifecycleError(this, this.onBeforePhysicsUpdate, delta, elapsed);
        for (const component of this.components) {
            component[s_OnBeforePhysicsUpdate](delta, elapsed);
        }
    }
    [s_OnUpdate](delta, elapsed) {
        if (!this[s_Enabled] || !this[s_InScene])
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
            return;
        }
        if (!this[s_Started])
            this[s_OnStart]();
        reportLifecycleError(this, this.onUpdate, delta, elapsed);
        for (const component of this.components) {
            component[s_OnUpdate](delta, elapsed);
        }
    }
    [s_OnLeaveScene]() {
        if (this[s_Destroyed])
            return;
        if (!this[s_InScene])
            return;
        reportLifecycleError(this, this.onLeaveScene);
        this[s_InScene] = false;
        for (const component of this.components) {
            component[s_OnLeaveScene]();
            if (isActor(component))
                component.object3d.removeFromParent();
        }
    }
    [s_OnDestroy]() {
        if (this[s_Destroyed])
            return;
        reportLifecycleError(this, this.onDestroy);
        this[s_Destroyed] = true;
        for (const component of this.components)
            component[s_OnDestroy]();
    }
    [s_OnReparent](newParent) {
        if (newParent === this[s_Parent]) {
            if (isDev())
                ELYSIA_LOGGER.warn(`Trying to reparent actor to the same parent: ${this}`);
        }
        this[s_Parent] = newParent;
        reportLifecycleError(this, this.onReparent, newParent);
    }
    [s_OnResize](width, height) {
        reportLifecycleError(this, this.onResize, width, height);
        for (const component of this.components) {
            component[s_OnResize](width, height);
        }
    }
}
const tempVec2 = new Three.Vector2();
