var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __propKey = (this && this.__propKey) || function (x) {
    return typeof x === "symbol" ? x : "".concat(x);
};
import * as Three from "three";
import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent } from "../Core/ElysiaEvents.js";
import { isActor } from "./Component.js";
import { isDev } from "../Core/Asserts.js";
import { bound } from "../Core/Utilities.js";
import { ComponentSet } from "../Containers/ComponentSet.js";
import { Internal, OnBeforePhysicsUpdate, OnCreate, OnDisable, OnEnable, OnEnterScene, OnLeaveScene, OnReparent, OnResize, OnStart, OnUpdate } from "../Core/Internal.js";
import { reportLifecycleError } from "../Core/Error.js";
export const IsActor = Symbol.for("Elysia::IsActor");
let Actor = (() => {
    var _a, _b, _c;
    var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    let _instanceExtraInitializers = [];
    let _onCreate_decorators;
    let _onEnable_decorators;
    let _onStart_decorators;
    let _onEnterScene_decorators;
    let _onBeforePhysicsUpdate_decorators;
    let _onUpdate_decorators;
    let _onLeaveScene_decorators;
    let _onDisable_decorators;
    let _onDestroy_decorators;
    let _onReparent_decorators;
    let _onResize_decorators;
    let _updateObject3d_decorators;
    let _enable_decorators;
    let _disable_decorators;
    let _addTag_decorators;
    let _removeTag_decorators;
    let _addComponent_decorators;
    let _removeComponent_decorators;
    let _stealComponent_decorators;
    let _giveComponent_decorators;
    let _getComponentsByType_decorators;
    let _getComponentsByTag_decorators;
    let _destructor_decorators;
    let _member_decorators;
    let _member_decorators_1;
    let _member_decorators_2;
    let _member_decorators_3;
    let _member_decorators_4;
    let _member_decorators_5;
    let _member_decorators_6;
    let _member_decorators_7;
    let _member_decorators_8;
    let _member_decorators_9;
    return _a = class Actor {
            constructor() {
                Object.defineProperty(this, _b, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: (__runInitializers(this, _instanceExtraInitializers), true)
                });
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: "Actor"
                });
                Object.defineProperty(this, "components", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: new Set
                });
                Object.defineProperty(this, "tags", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: new Set
                });
                /* **********************************************************
                    Internal
                ************************************************************/
                Object.defineProperty(this, _c, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: {
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
                    }
                });
            }
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
            updateObject3d(object3d) {
                if (this[Internal].object3d === object3d)
                    return;
                const parent = this[Internal].object3d.parent;
                this[Internal].object3d.parent?.remove(this[Internal].object3d);
                this[Internal].object3d.actor = undefined;
                // set this actor as the actor of the object3d
                object3d.actor = this;
                this[Internal].object3d = object3d;
                if (parent) {
                    parent.add(object3d);
                }
            }
            /**
             * Enables this actor. This means it receives updates and is visible.
             */
            enable() { this[OnEnable](); }
            /**
             * Disables this actor. This means it does not receive updates and is not visible.
             */
            disable() { this[OnDisable](); }
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
            getComponentsByType(type) {
                return this[Internal].componentsByType.get(type) ?? new ComponentSet;
            }
            /**
             * Gets all components with a certain tag directly attached to this actor.
             */
            getComponentsByTag(tag) {
                return this[Internal].componentsByTag.get(tag) ?? new ComponentSet;
            }
            /**
             * Destroys this actor and all its components.
             * Recursively destroys all children actors, starting from the deepest children.
             */
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
            [(_b = IsActor, _c = (_onCreate_decorators = [bound], _onEnable_decorators = [bound], _onStart_decorators = [bound], _onEnterScene_decorators = [bound], _onBeforePhysicsUpdate_decorators = [bound], _onUpdate_decorators = [bound], _onLeaveScene_decorators = [bound], _onDisable_decorators = [bound], _onDestroy_decorators = [bound], _onReparent_decorators = [bound], _onResize_decorators = [bound], _updateObject3d_decorators = [bound], _enable_decorators = [bound], _disable_decorators = [bound], _addTag_decorators = [bound], _removeTag_decorators = [bound], _addComponent_decorators = [bound], _removeComponent_decorators = [bound], _stealComponent_decorators = [bound], _giveComponent_decorators = [bound], _getComponentsByType_decorators = [bound], _getComponentsByTag_decorators = [bound], _destructor_decorators = [bound], Internal), _member_decorators = [bound], _d = __propKey(OnEnable))](runEvenIfAlreadyEnabled = false) {
                if (this[Internal].enabled && !runEvenIfAlreadyEnabled)
                    return;
                this[Internal].enabled = true;
                this.object3d.visible = true;
                this.onEnable();
                this[OnStart]();
                this[OnEnterScene]();
            }
            [(_member_decorators_1 = [bound], _e = __propKey(OnDisable))]() {
                if (!this[Internal].enabled)
                    return;
                this[Internal].enabled = false;
                this.object3d.visible = false;
                this.onDisable();
            }
            [(_member_decorators_2 = [reportLifecycleError, bound], _f = __propKey(OnCreate))]() {
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
            [(_member_decorators_3 = [reportLifecycleError, bound], _g = __propKey(OnStart))]() {
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
            [(_member_decorators_4 = [reportLifecycleError, bound], _h = __propKey(OnEnterScene))]() {
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
            [(_member_decorators_5 = [reportLifecycleError, bound], _j = __propKey(OnBeforePhysicsUpdate))](delta, elapsed) {
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
            [(_member_decorators_6 = [reportLifecycleError, bound], _k = __propKey(OnUpdate))](delta, elapsed) {
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
            [(_member_decorators_7 = [reportLifecycleError, bound], _l = __propKey(OnLeaveScene))]() {
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
            [(_member_decorators_8 = [reportLifecycleError, bound], _m = __propKey(OnReparent))](newParent) {
                if (newParent === this[Internal].parent) {
                    if (isDev())
                        ELYSIA_LOGGER.warn(`Trying to reparent actor to the same parent: ${this}`);
                }
                this[Internal].parent = newParent;
                this.onReparent(newParent);
            }
            [(_member_decorators_9 = [reportLifecycleError, bound], _o = __propKey(OnResize))](width, height) {
                this.onResize(width, height);
                for (const component of this.components)
                    component[OnResize](width, height);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(_a, null, _onCreate_decorators, { kind: "method", name: "onCreate", static: false, private: false, access: { has: obj => "onCreate" in obj, get: obj => obj.onCreate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onEnable_decorators, { kind: "method", name: "onEnable", static: false, private: false, access: { has: obj => "onEnable" in obj, get: obj => obj.onEnable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onStart_decorators, { kind: "method", name: "onStart", static: false, private: false, access: { has: obj => "onStart" in obj, get: obj => obj.onStart }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onEnterScene_decorators, { kind: "method", name: "onEnterScene", static: false, private: false, access: { has: obj => "onEnterScene" in obj, get: obj => obj.onEnterScene }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onBeforePhysicsUpdate_decorators, { kind: "method", name: "onBeforePhysicsUpdate", static: false, private: false, access: { has: obj => "onBeforePhysicsUpdate" in obj, get: obj => obj.onBeforePhysicsUpdate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onUpdate_decorators, { kind: "method", name: "onUpdate", static: false, private: false, access: { has: obj => "onUpdate" in obj, get: obj => obj.onUpdate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onLeaveScene_decorators, { kind: "method", name: "onLeaveScene", static: false, private: false, access: { has: obj => "onLeaveScene" in obj, get: obj => obj.onLeaveScene }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onDisable_decorators, { kind: "method", name: "onDisable", static: false, private: false, access: { has: obj => "onDisable" in obj, get: obj => obj.onDisable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onDestroy_decorators, { kind: "method", name: "onDestroy", static: false, private: false, access: { has: obj => "onDestroy" in obj, get: obj => obj.onDestroy }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onReparent_decorators, { kind: "method", name: "onReparent", static: false, private: false, access: { has: obj => "onReparent" in obj, get: obj => obj.onReparent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onResize_decorators, { kind: "method", name: "onResize", static: false, private: false, access: { has: obj => "onResize" in obj, get: obj => obj.onResize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateObject3d_decorators, { kind: "method", name: "updateObject3d", static: false, private: false, access: { has: obj => "updateObject3d" in obj, get: obj => obj.updateObject3d }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _enable_decorators, { kind: "method", name: "enable", static: false, private: false, access: { has: obj => "enable" in obj, get: obj => obj.enable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _disable_decorators, { kind: "method", name: "disable", static: false, private: false, access: { has: obj => "disable" in obj, get: obj => obj.disable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addTag_decorators, { kind: "method", name: "addTag", static: false, private: false, access: { has: obj => "addTag" in obj, get: obj => obj.addTag }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _removeTag_decorators, { kind: "method", name: "removeTag", static: false, private: false, access: { has: obj => "removeTag" in obj, get: obj => obj.removeTag }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addComponent_decorators, { kind: "method", name: "addComponent", static: false, private: false, access: { has: obj => "addComponent" in obj, get: obj => obj.addComponent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _removeComponent_decorators, { kind: "method", name: "removeComponent", static: false, private: false, access: { has: obj => "removeComponent" in obj, get: obj => obj.removeComponent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _stealComponent_decorators, { kind: "method", name: "stealComponent", static: false, private: false, access: { has: obj => "stealComponent" in obj, get: obj => obj.stealComponent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _giveComponent_decorators, { kind: "method", name: "giveComponent", static: false, private: false, access: { has: obj => "giveComponent" in obj, get: obj => obj.giveComponent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getComponentsByType_decorators, { kind: "method", name: "getComponentsByType", static: false, private: false, access: { has: obj => "getComponentsByType" in obj, get: obj => obj.getComponentsByType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getComponentsByTag_decorators, { kind: "method", name: "getComponentsByTag", static: false, private: false, access: { has: obj => "getComponentsByTag" in obj, get: obj => obj.getComponentsByTag }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _destructor_decorators, { kind: "method", name: "destructor", static: false, private: false, access: { has: obj => "destructor" in obj, get: obj => obj.destructor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators, { kind: "method", name: _d, static: false, private: false, access: { has: obj => _d in obj, get: obj => obj[_d] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_1, { kind: "method", name: _e, static: false, private: false, access: { has: obj => _e in obj, get: obj => obj[_e] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_2, { kind: "method", name: _f, static: false, private: false, access: { has: obj => _f in obj, get: obj => obj[_f] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_3, { kind: "method", name: _g, static: false, private: false, access: { has: obj => _g in obj, get: obj => obj[_g] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_4, { kind: "method", name: _h, static: false, private: false, access: { has: obj => _h in obj, get: obj => obj[_h] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_5, { kind: "method", name: _j, static: false, private: false, access: { has: obj => _j in obj, get: obj => obj[_j] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_6, { kind: "method", name: _k, static: false, private: false, access: { has: obj => _k in obj, get: obj => obj[_k] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_7, { kind: "method", name: _l, static: false, private: false, access: { has: obj => _l in obj, get: obj => obj[_l] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_8, { kind: "method", name: _m, static: false, private: false, access: { has: obj => _m in obj, get: obj => obj[_m] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_9, { kind: "method", name: _o, static: false, private: false, access: { has: obj => _o in obj, get: obj => obj[_o] }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { Actor };
