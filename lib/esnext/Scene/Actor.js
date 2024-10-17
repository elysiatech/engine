import * as Three from "three";
import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent } from "../Core/ElysiaEvents.js";
import { isActor } from "./Component.js";
import { isDev } from "../Core/Asserts.js";
import { bound } from "../Core/Utilities.js";
import { ComponentSet } from "../Containers/ComponentSet.js";
import { Internal, OnBeforePhysicsUpdate, OnCreate, OnDestroy, OnDisable, OnEnable, OnEnterScene, OnLeaveScene, OnReparent, OnResize, OnStart, OnUpdate } from "../Core/Internal.js";
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
        const parent = this[Internal].object3d.parent;
        this[Internal].object3d.parent?.remove(this[Internal].object3d);
        this[Internal].object3d.actor = undefined;
        // set this actor as the actor of the object3d
        object3d.actor = this;
        this[Internal].object3d = object3d;
        if (!object3d.hasElysiaEvents) {
            object3d.addEventListener("added", (e) => {
                object3d.actor?.[OnEnterScene]();
            });
            object3d.addEventListener("removed", (e) => {
                object3d.actor?.[OnLeaveScene]();
            });
            object3d.hasElysiaEvents = true;
        }
        if (parent) {
            parent.add(object3d);
        }
    }
    /**
     * Enables this actor. This means it receives updates and is visible.
     */
    @bound
    enable() { this[OnEnable](true); }
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
            this[Internal].componentsByType.set(component.constructor, new ComponentSet);
        }
        this[Internal].componentsByType.get(component.constructor).add(component);
        if (isActor(component)) {
            for (const tag of component.tags) {
                if (!this[Internal].componentsByTag.has(tag)) {
                    this[Internal].componentsByTag.set(tag, new ComponentSet);
                }
                this[Internal].componentsByTag.get(tag).add(component);
            }
        }
        ElysiaEventDispatcher.dispatchEvent(new ComponentAddedEvent({ parent: this, child: component }));
        component[Internal].parent = this;
        component[Internal].scene = this[Internal].scene;
        component[Internal].app = this[Internal].app;
        if (this[Internal].created)
            component[OnCreate]();
        if (this[Internal].inScene) {
            if (isActor(component))
                this.object3d.add(component.object3d);
            component[OnEnterScene]();
        }
        if (this[Internal].inScene && this[Internal].enabled)
            component[OnEnable]();
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
        }
        component[OnLeaveScene]();
        isActor(component) && this.object3d.remove(component.object3d);
        component[OnDisable]();
        return true;
    }
    /**
     * Gets all components of a certain type directly attached to this actor.
     */
    @bound
    getComponentsByType(type) {
        const set = this[Internal].componentsByType.get(type);
        if (!set) {
            const newSet = new ComponentSet;
            (this[Internal].componentsByType.set(type, newSet));
            return newSet;
        }
        else
            return set;
    }
    /**
     * Gets all components with a certain tag directly attached to this actor.
     */
    @bound
    getComponentsByTag(tag) {
        const set = this[Internal].componentsByTag.get(tag);
        if (!set) {
            const newSet = new ComponentSet;
            (this[Internal].componentsByTag.set(tag, newSet));
            return newSet;
        }
        else
            return set;
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
        this[OnDisable]();
        this[Internal].parent?.removeComponent(this);
        this[OnDestroy]();
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
        _enabled: false,
        inScene: false,
        destroyed: false,
        componentsByType: new Map,
        componentsByTag: new Map,
    };
    @reportLifecycleError
    @bound
    [OnEnable](force = false) {
        if (!force && !this[Internal].enabled)
            return;
        if (this[Internal]._enabled || this[Internal].destroyed)
            return;
        this[Internal].enabled = true;
        this[Internal]._enabled = true;
        this.object3d.visible = true;
        this.onEnable();
        for (const component of this.components) {
            component[OnEnable]();
        }
    }
    @reportLifecycleError
    @bound
    [OnDisable]() {
        if (!this[Internal].enabled || this[Internal].destroyed)
            return;
        this[Internal].enabled = false;
        this[Internal]._enabled = false;
        this.object3d.visible = false;
        this.onDisable();
        for (const component of this.components) {
            component[OnDisable]();
        }
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
        this.onCreate();
        this.app.renderPipeline.getRenderer().getSize(tempVec2);
        this.onResize(tempVec2.x, tempVec2.y);
        this[Internal].created = true;
        for (const component of this.components) {
            component[Internal].app = this.app;
            component[Internal].scene = this.scene;
            component[Internal].parent = this;
            if (!component.created)
                component[OnCreate]();
        }
    }
    @reportLifecycleError
    @bound
    [OnEnterScene]() {
        if (this[Internal].inScene || !this[Internal].created)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn(`Trying to add a destroyed actor to scene: ${this}`);
            return;
        }
        this.onEnterScene();
        this[Internal].inScene = true;
        for (const component of this.components) {
            if (isActor(component))
                this.object3d.add(component.object3d);
            component[OnEnterScene]();
        }
    }
    @reportLifecycleError
    @bound
    [OnStart]() {
        if (this[Internal].started)
            return;
        if (!this[Internal].inScene || !this.enabled)
            return;
        if (this[Internal].destroyed) {
            ELYSIA_LOGGER.warn(`Trying to start a destroyed actor: ${this}`);
            return;
        }
        this.onStart();
        this[Internal].started = true;
        for (const component of this.components) {
            if (!component.started)
                component[OnStart]();
        }
    }
    @reportLifecycleError
    @bound
    [OnBeforePhysicsUpdate](delta, elapsed) {
        if (!this[Internal].enabled || !this[Internal].inScene)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
            return;
        }
        if (!this[Internal].started)
            this[OnStart]();
        this.onBeforePhysicsUpdate(delta, elapsed);
        for (const component of this.components) {
            component[OnBeforePhysicsUpdate](delta, elapsed);
        }
    }
    @reportLifecycleError
    @bound
    [OnUpdate](delta, elapsed) {
        if (!this[Internal].enabled || !this[Internal].inScene)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
            return;
        }
        if (!this[Internal].started)
            this[OnStart]();
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
        this.onLeaveScene();
        this[Internal].inScene = false;
        for (const component of this.components) {
            component[OnLeaveScene]();
            if (isActor(component))
                component.object3d.removeFromParent();
        }
    }
    @reportLifecycleError
    @bound
    [OnDestroy]() {
        if (this[Internal].destroyed)
            return;
        this.onDestroy();
        this[Internal].destroyed = true;
        for (const component of this.components)
            component.onDestroy();
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
const tempVec2 = new Three.Vector2();
