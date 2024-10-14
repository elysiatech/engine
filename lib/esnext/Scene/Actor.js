import * as Three from "three";
import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent } from "../Core/ElysiaEvents.js";
import { isActor } from "./Component.js";
import { isDev } from "../Core/Asserts.js";
import { bound } from "../Core/Utilities.js";
import { SparseSet } from "../Containers/SparseSet.js";
import { Internal, OnBeforePhysicsUpdate, OnCreate, OnDisable, OnEnable, OnEnterScene, OnLeaveScene, OnReparent, OnResize, OnStart, OnUpdate } from "../Core/Internal.js";
import { reportLifecycleError } from "../Core/Error.js";
export const IsActor = Symbol.for("Elysia::IsActor");
export class Actor {
    [IsActor] = true;
    type = "Actor";
    /**
     * The underlying Three.js object.
     * This should be used with caution, as it can break the internal state of the actor in some cases.
     */
    get object3d() { return this[Internal].object3d; }
    set object3d(object3d) { this.updateObject3d(object3d); }
    get created() { return this[Internal].created; }
    get enabled() { return this[Internal].enabled; }
    get started() { return this[Internal].started; }
    get inScene() { return this[Internal].inScene; }
    get destroyed() { return this[Internal].destroyed; }
    get app() { return this[Internal].app; }
    get scene() { return this[Internal].scene; }
    get parent() { return this[Internal].parent; }
    get position() { return this[Internal].object3d.position; }
    set position(position) { this[Internal].object3d.position.copy(position); }
    get rotation() { return this[Internal].object3d.rotation; }
    set rotation(rotation) { this[Internal].object3d.rotation.copy(rotation); }
    get scale() { return this[Internal].object3d.scale; }
    set scale(scale) { this[Internal].object3d.scale.copy(scale); }
    get quaternion() { return this[Internal].object3d.quaternion; }
    set quaternion(quaternion) { this[Internal].object3d.quaternion.copy(quaternion); }
    components = new Set;
    tags = new Set;
    /* **********************************************************
        Lifecycle methods
    ************************************************************/
    @bound
    onCreate() { }
    @bound
    onEnable() { }
    @bound
    onStart() { }
    @bound
    onEnterScene() { }
    @bound
    onBeforePhysicsUpdate(delta, elapsed) { }
    @bound
    onUpdate(delta, elapsed) { }
    @bound
    onLeaveScene() { }
    @bound
    onDisable() { }
    @bound
    onDestroy() { }
    @bound
    onReparent(parent) { }
    @bound
    onResize(width, height) { }
    /* **********************************************************
        Public methods
    ************************************************************/
    @bound
    updateObject3d(object3d) {
        if (this[Internal].object3d === object3d)
            return;
        this[Internal].object3d.parent?.remove(this[Internal].object3d);
        this[Internal].object3d.actor = undefined;
        // set this actor as the actor of the object3d
        object3d.actor = this;
        this[Internal].object3d = object3d;
    }
    /**
     * Enables this actor. This means it receives updates and is visible.
     */
    @bound
    enable() { this[OnEnable](); }
    /**
     * Disables this actor. This means it does not receive updates and is not visible.
     */
    @bound
    disable() { this[OnDisable](); }
    /**
     * Adds a tag to this actor.
     * @param tag
     */
    @bound
    addTag(tag) {
        ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
        this.tags.add(tag);
    }
    /**
     * Removes a tag from this actor.
     * @param tag
     */
    @bound
    removeTag(tag) {
        ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
        this.tags.delete(tag);
    }
    /**
     * Adds a component to this actor.
     * @param component
     * @returns `true` if the component was successfully added, `false` otherwise.
     */
    @bound
    addComponent(component) {
        if (this[Internal].destroyed) {
            ELYSIA_LOGGER.warn("Trying to add component to a destroyed actor");
            return false;
        }
        if (component.destroyed) {
            ELYSIA_LOGGER.warn("Trying to add destroyed component to actor");
            return false;
        }
        this.components.add(component);
        if (!this[Internal].componentsByType.has(component.constructor)) {
            this[Internal].componentsByType.set(component.constructor, new SparseSet);
        }
        this[Internal].componentsByType.get(component.constructor).add(component);
        if (isActor(component)) {
            for (const tag of component.tags) {
                if (!this[Internal].componentsByTag.has(tag)) {
                    this[Internal].componentsByTag.set(tag, new SparseSet);
                }
                this[Internal].componentsByTag.get(tag).add(component);
            }
            this.object3d.add(component.object3d);
        }
        ElysiaEventDispatcher.dispatchEvent(new ComponentAddedEvent({ parent: this, child: component }));
        component[Internal].parent = this;
        component[Internal].scene = this[Internal].scene;
        component[Internal].app = this[Internal].app;
        if (this[Internal].created)
            component[OnCreate]();
        if (this[Internal].started)
            component[OnStart]();
        if (this[Internal].inScene)
            component[OnEnterScene]();
        return true;
    }
    /**
     * Removes a component from this actor.
     * @param component
     * @returns `true` if the component was successfully removed, `false` otherwise.
     */
    @bound
    removeComponent(component) {
        if (this[Internal].destroyed) {
            ELYSIA_LOGGER.warn("Trying to remove component from a destroyed actor");
            return false;
        }
        if (component.destroyed) {
            ELYSIA_LOGGER.warn("Trying to remove destroyed component from actor");
            return false;
        }
        ElysiaEventDispatcher.dispatchEvent(new ComponentRemovedEvent({ parent: this, child: component }));
        this.components.delete(component);
        this[Internal].componentsByType.get(component.constructor)?.delete(component);
        if (isActor(component)) {
            for (const tag of component.tags) {
                this[Internal].componentsByTag.get(tag)?.delete(component);
            }
            this.object3d.remove(component.object3d);
        }
        component[OnLeaveScene]();
        return true;
    }
    /**
     * Reparents a component to this actor.
     * @param component
     * @returns `true` if the component was successfully reparented, `false` otherwise.
     */
    @bound
    stealComponent(component) {
        if (this[Internal].destroyed) {
            ELYSIA_LOGGER.warn("Trying to reparent component to a destroyed actor");
            return false;
        }
        if (component.destroyed) {
            ELYSIA_LOGGER.warn("Trying to reparent destroyed component to actor");
            return false;
        }
        this.components.add(component);
        if (isActor(component)) {
            this.object3d.add(component.object3d);
        }
        component[Internal].parent = this;
        component[OnReparent](this);
        component[OnCreate]();
        component[OnEnable]();
        component[OnStart]();
        component[OnEnterScene]();
        return true;
    }
    /**
     * Reparents a component to another actor.
     * @param component
     * @param newParent
     * @returns `true` if the component was successfully reparented, `false` otherwise.
     */
    @bound
    giveComponent(component, newParent) {
        if (this[Internal].destroyed) {
            ELYSIA_LOGGER.warn("Trying to give component to a destroyed actor");
            return false;
        }
        if (component.destroyed) {
            ELYSIA_LOGGER.warn("Trying to give destroyed component to actor");
            return false;
        }
        this.components.delete(component);
        if (isActor(component)) {
            this.object3d.remove(component.object3d);
        }
        component[Internal].parent = newParent;
        component[OnReparent](newParent);
        newParent.components.add(component);
        if (isActor(component)) {
            newParent.object3d.add(component.object3d);
        }
        component[OnCreate]();
        component[OnEnable]();
        component[OnStart]();
        component[OnEnterScene]();
        return true;
    }
    /**
     * Gets all components of a certain type directly attached to this actor.
     */
    @bound
    getComponentsByType(type) {
        return this[Internal].componentsByType.get(type) ?? new SparseSet;
    }
    /**
     * Gets all components with a certain tag directly attached to this actor.
     */
    @bound
    getComponentsByTag(tag) {
        return this[Internal].componentsByTag.get(tag) ?? new SparseSet;
    }
    /**
     * Destroys this actor and all its components.
     * Recursively destroys all children actors, starting from the deepest children.
     */
    @bound
    destructor() {
        if (this[Internal].destroyed)
            return;
        for (const component of this.components) {
            component.destructor();
        }
        this[OnLeaveScene]();
        this.onDestroy();
        this[Internal].parent?.removeComponent(this);
        this[Internal].object3d.actor = undefined;
        this[Internal].object3d.parent?.remove(this[Internal].object3d);
        this[Internal].parent = null;
        this[Internal].scene = null;
        this[Internal].app = null;
        this[Internal].destroyed = true;
    }
    /* **********************************************************
        Internal
    ************************************************************/
    [Internal] = {
        object3d: ((e) => (e.actor = this, e))(new Three.Object3D),
        parent: null,
        scene: null,
        app: null,
        created: false,
        started: false,
        enabled: true,
        inScene: false,
        destroyed: false,
        componentsByType: new Map,
        componentsByTag: new Map,
    };
    @bound
    [OnEnable](runEvenIfAlreadyEnabled = false) {
        if (this[Internal].enabled && !runEvenIfAlreadyEnabled)
            return;
        this[Internal].enabled = true;
        this.object3d.visible = true;
        this.onEnable();
        this[OnStart]();
        this[OnEnterScene]();
    }
    @bound
    [OnDisable]() {
        if (!this[Internal].enabled)
            return;
        this[Internal].enabled = false;
        this.object3d.visible = false;
        this.onDisable();
    }
    @reportLifecycleError
    @bound
    [OnCreate]() {
        if (this[Internal].created)
            return;
        if (this[Internal].destroyed) {
            ELYSIA_LOGGER.warn(`Trying to create a destroyed actor: ${this}`);
            return;
        }
        this[Internal].created = true;
        this.onCreate();
        for (const component of this.components) {
            component[Internal].scene = this[Internal].scene;
            component[Internal].app = this[Internal].app;
            component[OnCreate]();
        }
    }
    @reportLifecycleError
    @bound
    [OnStart]() {
        if (this[Internal].started || !this[Internal].enabled || !this[Internal].created)
            return;
        if (this[Internal].destroyed) {
            ELYSIA_LOGGER.warn(`Trying to start a destroyed actor: ${this}`);
            return;
        }
        this[Internal].started = true;
        this.onStart();
        for (const component of this.components) {
            component[OnStart]();
        }
    }
    @reportLifecycleError
    @bound
    [OnEnterScene]() {
        if (this[Internal].inScene)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn(`Trying to add a destroyed actor to scene: ${this}`);
            return;
        }
        if (!this[Internal].started)
            return;
        if (!this[Internal].enabled)
            return;
        this[Internal].inScene = true;
        this[OnEnable](true);
        for (const component of this.components)
            component[OnEnterScene]();
    }
    @reportLifecycleError
    @bound
    [OnBeforePhysicsUpdate](delta, elapsed) {
        if (!this[Internal].enabled)
            return;
        if (!this[Internal].inScene)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
            return;
        }
        this.onBeforePhysicsUpdate(delta, elapsed);
        for (const component of this.components) {
            component[OnBeforePhysicsUpdate](delta, elapsed);
        }
    }
    @reportLifecycleError
    @bound
    [OnUpdate](delta, elapsed) {
        if (!this[Internal].enabled)
            return;
        if (!this[Internal].inScene)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
            return;
        }
        this.onUpdate(delta, elapsed);
        for (const component of this.components) {
            component[OnUpdate](delta, elapsed);
        }
    }
    @reportLifecycleError
    @bound
    [OnLeaveScene]() {
        if (this[Internal].destroyed)
            return;
        if (!this[Internal].inScene)
            return;
        this[Internal].inScene = false;
        this[OnDisable]();
        this.onLeaveScene();
        for (const component of this.components)
            component[OnLeaveScene]();
    }
    @reportLifecycleError
    @bound
    [OnReparent](newParent) {
        if (newParent === this[Internal].parent) {
            if (isDev())
                ELYSIA_LOGGER.warn(`Trying to reparent actor to the same parent: ${this}`);
        }
        this[Internal].parent = newParent;
        this.onReparent(newParent);
    }
    @reportLifecycleError
    @bound
    [OnResize](width, height) {
        this.onResize(width, height);
        for (const component of this.components)
            component[OnResize](width, height);
    }
}
