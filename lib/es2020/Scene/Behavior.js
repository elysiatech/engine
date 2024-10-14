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
let Behavior = (() => {
    var _a, _b, _c;
    var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    let _instanceExtraInitializers = [];
    let _onCreate_decorators;
    let _onEnable_decorators;
    let _onStart_decorators;
    let _onEnterScene_decorators;
    let _onBeforePhysicsUpdate_decorators;
    let _onUpdate_decorators;
    let _onDisable_decorators;
    let _onLeaveScene_decorators;
    let _onDestroy_decorators;
    let _onReparent_decorators;
    let _onResize_decorators;
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
    return _a = class Behavior {
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
                    value: "Behavior"
                });
                /* **********************************************************
                    Internal
                ************************************************************/
                Object.defineProperty(this, _c, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: {
                        app: null,
                        scene: null,
                        parent: null,
                        tags: new Set(),
                        enabled: true,
                        created: false,
                        started: false,
                        inScene: false,
                        destroyed: false,
                    }
                });
            }
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
            onCreate() { }
            onEnable() { }
            onStart() { }
            onEnterScene() { }
            onBeforePhysicsUpdate(delta, elapsed) { }
            onUpdate(delta, elapsed) { }
            onDisable() { }
            onLeaveScene() { }
            onDestroy() { }
            onReparent(parent) { }
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
            [(_b = IsBehavior, _c = (_onCreate_decorators = [bound], _onEnable_decorators = [bound], _onStart_decorators = [bound], _onEnterScene_decorators = [bound], _onBeforePhysicsUpdate_decorators = [bound], _onUpdate_decorators = [bound], _onDisable_decorators = [bound], _onLeaveScene_decorators = [bound], _onDestroy_decorators = [bound], _onReparent_decorators = [bound], _onResize_decorators = [bound], Internal), _member_decorators = [reportLifecycleError, bound], _d = __propKey(OnEnable))](runEvenIfAlreadyEnabled = false) {
                if (this[Internal].enabled && !runEvenIfAlreadyEnabled)
                    return;
                if (this.destroyed) {
                    ELYSIA_LOGGER.warn("Cannot enable a destroyed behavior:", this);
                    return;
                }
                this[Internal].enabled = true;
                this.onEnable();
            }
            [(_member_decorators_1 = [reportLifecycleError, bound], _e = __propKey(OnDisable))]() {
                if (!this[Internal].enabled)
                    return;
                if (this.destroyed) {
                    ELYSIA_LOGGER.warn("Cannot disable a destroyed behavior:", this);
                    return;
                }
                this[Internal].enabled = false;
                this.onDisable();
            }
            [(_member_decorators_2 = [reportLifecycleError, bound], _f = __propKey(OnCreate))]() {
                if (this[Internal].created)
                    return;
                if (this.destroyed) {
                    ELYSIA_LOGGER.warn("Cannot create a destroyed behavior:", this);
                    return;
                }
                this[Internal].created = true;
                this.onCreate();
            }
            [(_member_decorators_3 = [reportLifecycleError, bound], _g = __propKey(OnStart))]() {
                if (this[Internal].started)
                    return;
                if (this.destroyed) {
                    ELYSIA_LOGGER.warn("Cannot start a destroyed behavior:", this);
                    return;
                }
                this[Internal].started = true;
                this.onStart();
            }
            [(_member_decorators_4 = [reportLifecycleError, bound], _h = __propKey(OnEnterScene))]() {
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
            [(_member_decorators_5 = [reportLifecycleError, bound], _j = __propKey(OnBeforePhysicsUpdate))](delta, elapsed) {
                if (this.destroyed)
                    return;
                this.onBeforePhysicsUpdate(delta, elapsed);
            }
            [(_member_decorators_6 = [reportLifecycleError, bound], _k = __propKey(OnUpdate))](delta, elapsed) {
                if (this.destroyed)
                    return;
                this.onUpdate(delta, elapsed);
            }
            [(_member_decorators_7 = [reportLifecycleError, bound], _l = __propKey(OnLeaveScene))]() {
                if (this.destroyed)
                    return;
                if (!this[Internal].inScene)
                    return;
                this[Internal].inScene = false;
                this[OnDisable]();
                this.onLeaveScene();
            }
            [(_member_decorators_8 = [reportLifecycleError, bound], _m = __propKey(OnReparent))](parent) {
                if (this.destroyed) {
                    ELYSIA_LOGGER.warn("Cannot reparent a destroyed behavior:", this);
                    return;
                }
                this.onReparent(parent);
            }
            [(_member_decorators_9 = [reportLifecycleError, bound], _o = __propKey(OnResize))](width, height) {
                this.onResize(width, height);
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
            __esDecorate(_a, null, _onDisable_decorators, { kind: "method", name: "onDisable", static: false, private: false, access: { has: obj => "onDisable" in obj, get: obj => obj.onDisable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onLeaveScene_decorators, { kind: "method", name: "onLeaveScene", static: false, private: false, access: { has: obj => "onLeaveScene" in obj, get: obj => obj.onLeaveScene }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onDestroy_decorators, { kind: "method", name: "onDestroy", static: false, private: false, access: { has: obj => "onDestroy" in obj, get: obj => obj.onDestroy }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onReparent_decorators, { kind: "method", name: "onReparent", static: false, private: false, access: { has: obj => "onReparent" in obj, get: obj => obj.onReparent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onResize_decorators, { kind: "method", name: "onResize", static: false, private: false, access: { has: obj => "onResize" in obj, get: obj => obj.onResize }, metadata: _metadata }, null, _instanceExtraInitializers);
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
export { Behavior };
