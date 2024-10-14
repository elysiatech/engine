import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { TagAddedEvent } from "../Core/ElysiaEvents.js";
import { Internal, OnBeforePhysicsUpdate, OnCreate, OnDisable, OnEnable, OnEnterScene, OnLeaveScene, OnReparent, OnResize, OnStart, OnUpdate } from "../Core/Internal.js";
import { bound } from "../Core/Utilities.js";
import { reportLifecycleError } from "../Core/Error.js";
export const IsBehavior = Symbol.for("Elysia::IsBehavior");
/**
 * A behavior is a component that can be attached to an actor to add functionality.
 * It has no children but participates in the actor lifecycle.
 */
export class Behavior {
    [IsBehavior] = true;
    type = "Behavior";
    get created() { return this[Internal].created; }
    get started() { return this[Internal].started; }
    get destroyed() { return this[Internal].destroyed; }
    get enabled() { return this[Internal].enabled; }
    /**
     * The parent actor of this behavior.
     */
    get parent() { return this[Internal].parent; }
    /**
     * The scene this behavior belongs
     * to, if any.
     */
    get scene() { return this[Internal].scene; }
    /**
     * The application this behavior belongs to.
     */
    get app() { return this[Internal].app; }
    /**
     * The tags associated with this behavior.
     */
    get tags() { return this[Internal].tags; }
    /** Enable this behavior. */
    enable() { this[OnEnable](); }
    /** Disable this behavior. */
    disable() { this[OnDisable](); }
    /**
     * Adds a tag to this behavior
     * @param tag
     */
    addTag(tag) {
        ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
        this.tags.add(tag);
    }
    /**
     * Removes a tag from this behavior.
     * @param tag
     */
    removeTag(tag) {
        ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
        this.tags.delete(tag);
    }
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
    onDisable() { }
    @bound
    onLeaveScene() { }
    @bound
    onDestroy() { }
    @bound
    onReparent(parent) { }
    @bound
    onResize(width, height) { }
    destructor() {
        if (this[Internal].destroyed)
            return;
        this[OnLeaveScene]();
        this.onDestroy();
        this[Internal].parent = null;
        this[Internal].scene = null;
        this[Internal].app = null;
        this[Internal].destroyed = true;
    }
    /* **********************************************************
        Internal
    ************************************************************/
    [Internal] = {
        app: null,
        scene: null,
        parent: null,
        tags: new Set(),
        enabled: true,
        created: false,
        started: false,
        inScene: false,
        destroyed: false,
    };
    @reportLifecycleError
    @bound
    [OnEnable](runEvenIfAlreadyEnabled = false) {
        if (this[Internal].enabled && !runEvenIfAlreadyEnabled)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn("Cannot enable a destroyed behavior:", this);
            return;
        }
        this[Internal].enabled = true;
        this.onEnable();
    }
    @reportLifecycleError
    @bound
    [OnDisable]() {
        if (!this[Internal].enabled)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn("Cannot disable a destroyed behavior:", this);
            return;
        }
        this[Internal].enabled = false;
        this.onDisable();
    }
    @reportLifecycleError
    @bound
    [OnCreate]() {
        if (this[Internal].created)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn("Cannot create a destroyed behavior:", this);
            return;
        }
        this[Internal].created = true;
        this.onCreate();
    }
    @reportLifecycleError
    @bound
    [OnStart]() {
        if (this[Internal].started)
            return;
        if (this.destroyed) {
            ELYSIA_LOGGER.warn("Cannot start a destroyed behavior:", this);
            return;
        }
        this[Internal].started = true;
        this.onStart();
    }
    @reportLifecycleError
    @bound
    [OnEnterScene]() {
        if (this.destroyed) {
            ELYSIA_LOGGER.warn("Cannot enter scene a destroyed behavior:", this);
            return;
        }
        if (this[Internal].inScene)
            return;
        this[Internal].inScene = true;
        this[OnEnable](true);
        this.onEnterScene();
    }
    @reportLifecycleError
    @bound
    [OnBeforePhysicsUpdate](delta, elapsed) {
        if (this.destroyed)
            return;
        this.onBeforePhysicsUpdate(delta, elapsed);
    }
    @reportLifecycleError
    @bound
    [OnUpdate](delta, elapsed) {
        if (this.destroyed)
            return;
        this.onUpdate(delta, elapsed);
    }
    @reportLifecycleError
    @bound
    [OnLeaveScene]() {
        if (this.destroyed)
            return;
        if (!this[Internal].inScene)
            return;
        this[Internal].inScene = false;
        this[OnDisable]();
        this.onLeaveScene();
    }
    @reportLifecycleError
    @bound
    [OnReparent](parent) {
        if (this.destroyed) {
            ELYSIA_LOGGER.warn("Cannot reparent a destroyed behavior:", this);
            return;
        }
        this.onReparent(parent);
    }
    @reportLifecycleError
    @bound
    [OnResize](width, height) {
        this.onResize(width, height);
    }
}
