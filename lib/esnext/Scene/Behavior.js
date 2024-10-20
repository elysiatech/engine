import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { TagAddedEvent } from "../Core/ElysiaEvents.js";
import { s_App, s_Created, s_Destroyed, s_Enabled, s_InScene, s_OnBeforePhysicsUpdate, s_OnCreate, s_OnDestroy, s_OnDisable, s_OnEnable, s_OnEnterScene, s_OnLeaveScene, s_OnReparent, s_OnResize, s_OnStart, s_OnUpdate, s_Parent, s_Scene, s_Started, s_Tags } from "./Internal.js";
import { reportLifecycleError } from "./Errors.js";
import * as Three from "three";
import { isDev } from "../Core/Asserts.js";
export const IsBehavior = Symbol.for("Elysia::IsBehavior");
/**
 * A behavior is a component that can be attached to an actor to add functionality.
 * It has no children but participates in the actor lifecycle.
 */
export class Behavior {
    [IsBehavior] = true;
    type = "Behavior";
    /** If this behavior has completed it's onCreate() lifecycle. */
    get created() { return this[s_Created]; }
    /** If this behavior has completed it's onStart() lifecycle. */
    get started() { return this[s_Started]; }
    /** If this behavior has been destroyed. */
    get destroyed() { return this[s_Destroyed]; }
    /** If this behavior is enabled. */
    get enabled() { return this[s_Enabled]; }
    /** The parent actor of this behavior. */
    get parent() { return this[s_Parent]; }
    /** The scene this behavior belongs to. */
    get scene() { return this[s_Scene]; }
    /** The application this behavior belongs to. */
    get app() { return this[s_App]; }
    /** The tags associated with this behavior. */
    get tags() { return this[s_Tags]; }
    /** Enable this behavior. */
    enable() { this[s_OnEnable](); }
    /** Disable this behavior. */
    disable() { this[s_OnDisable](); }
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
    onCreate() { }
    onEnterScene() { }
    onEnable() { }
    onStart() { }
    onBeforePhysicsUpdate(delta, elapsed) { }
    onUpdate(delta, elapsed) { }
    onDisable() { }
    onLeaveScene() { }
    onDestroy() { }
    onReparent(parent) { }
    onResize(width, height) { }
    destructor() {
        if (this[s_Destroyed])
            return;
        this[s_OnLeaveScene]();
        this[s_OnDisable]();
        this[s_OnDestroy]();
        this[s_Parent] = null;
        this[s_Scene] = null;
        this[s_App] = null;
        this[s_Destroyed] = true;
    }
    /* **********************************************************
        s_Internal
    ************************************************************/
    [s_App] = null;
    [s_Scene] = null;
    [s_Parent] = null;
    [s_Tags] = new Set();
    [s_Enabled] = true;
    [s_Created] = false;
    [s_Started] = false;
    [s_InScene] = false;
    [s_Destroyed] = false;
    [s_OnEnable](force = false) {
        if (!force && !this[s_Enabled])
            return;
        if (this[s_Enabled] || this[s_Destroyed])
            return;
        this[s_Enabled] = true;
        reportLifecycleError(this, this.onEnable);
    }
    [s_OnDisable]() {
        if (!this[s_Enabled] || this[s_Destroyed])
            return;
        this[s_Enabled] = false;
        reportLifecycleError(this, this.onDisable);
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
        this.onResize(tempVec2.x, tempVec2.y);
        this[s_Created] = true;
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
    }
    [s_OnLeaveScene]() {
        if (this[s_Destroyed])
            return;
        if (!this[s_InScene])
            return;
        reportLifecycleError(this, this.onLeaveScene);
        this[s_InScene] = false;
    }
    [s_OnDestroy]() {
        if (this[s_Destroyed])
            return;
        reportLifecycleError(this, this.onDestroy);
        this[s_Destroyed] = true;
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
    }
}
const tempVec2 = new Three.Vector2();
