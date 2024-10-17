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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
import { Actor } from "./Actor.js";
import * as Three from "three";
import { Future } from "../Containers/Future.js";
import { bound, noop } from "../Core/Utilities.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent, TagRemovedEvent } from "../Core/ElysiaEvents.js";
import { isActor } from "./Component.js";
import { GridActor } from "../Actors/GridActor.js";
import { ComponentSet } from "../Containers/ComponentSet.js";
import { ActiveCamera, App, Internal, OnBeforePhysicsUpdate, OnCreate, OnDestroy, OnLoad, OnStart, OnUpdate, SceneLoadPromise } from "../Core/Internal.js";
export const Root = Symbol.for("Elysia::Scene::Root");
export const IsScene = Symbol.for("Elysia::IsScene");
let Scene = (() => {
    var _a, _Scene_grid, _Scene_ambientLight, _Scene_componentsByTag, _Scene_componentsByType, _Scene_allActors, _Scene_allBehaviors, _b, _c, _d, _e, _f, _g;
    var _h, _j, _k, _l, _m, _o;
    let _instanceExtraInitializers = [];
    let _addComponent_decorators;
    let _removeComponent_decorators;
    let _getComponentsByTag_decorators;
    let _getComponentsByType_decorators;
    let _getActiveCamera_decorators;
    let _member_decorators;
    let _member_decorators_1;
    let _member_decorators_2;
    let _member_decorators_3;
    let _member_decorators_4;
    let _member_decorators_5;
    return _a = class Scene {
            /** Get the root Three.Scene */
            get object3d() { return this[Root].object3d; }
            /** Get the owning Application */
            get app() { return this[App]; }
            /** Get the scene grid actor */
            get grid() { return __classPrivateFieldGet(this, _Scene_grid, "f"); }
            /** Get the scene's ambient light */
            get ambientLight() { return __classPrivateFieldGet(this, _Scene_ambientLight, "f"); }
            /** The scene's active camera */
            get activeCamera() { return this.getActiveCamera(); }
            set activeCamera(camera) {
                this[ActiveCamera] = camera instanceof Actor ? camera.object3d : camera;
                this[App]?.renderPipeline.onCameraChange(this[ActiveCamera]);
            }
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
                    value: "Scene"
                });
                Object.defineProperty(this, "physics", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, _c, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: new Future(noop)
                });
                Object.defineProperty(this, _d, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: new Three.PerspectiveCamera()
                });
                Object.defineProperty(this, _e, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: new SceneActor
                });
                Object.defineProperty(this, _f, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: null
                });
                Object.defineProperty(this, _g, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: {
                        loaded: false,
                        created: false,
                        started: false,
                        destroyed: false,
                    }
                });
                _Scene_grid.set(this, new GridActor);
                _Scene_ambientLight.set(this, new Three.AmbientLight(0xffffff, 1));
                _Scene_componentsByTag.set(this, new Map);
                _Scene_componentsByType.set(this, new Map);
                _Scene_allActors.set(this, new ComponentSet);
                _Scene_allBehaviors.set(this, new ComponentSet);
                ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {
                    const type = e.child.constructor;
                    if (!__classPrivateFieldGet(this, _Scene_componentsByType, "f").has(type))
                        __classPrivateFieldGet(this, _Scene_componentsByType, "f").set(type, new ComponentSet);
                    __classPrivateFieldGet(this, _Scene_componentsByType, "f").get(type).add(e.child);
                    if (isActor(e.child)) {
                        __classPrivateFieldGet(this, _Scene_allActors, "f").add(e.child);
                    }
                    else {
                        __classPrivateFieldGet(this, _Scene_allBehaviors, "f").add(e.child);
                    }
                });
                ElysiaEventDispatcher.addEventListener(ComponentRemovedEvent, (e) => {
                    const type = e.child.constructor;
                    __classPrivateFieldGet(this, _Scene_componentsByType, "f").get(type)?.delete(e.child);
                    if (isActor(e.child)) {
                        __classPrivateFieldGet(this, _Scene_allActors, "f").delete(e.child);
                    }
                    else {
                        __classPrivateFieldGet(this, _Scene_allBehaviors, "f").delete(e.child);
                    }
                    for (const tag of e.child.tags) {
                        __classPrivateFieldGet(this, _Scene_componentsByTag, "f").get(tag)?.delete(e.child);
                    }
                });
                ElysiaEventDispatcher.addEventListener(TagAddedEvent, (event) => {
                    if (!__classPrivateFieldGet(this, _Scene_componentsByTag, "f").has(event.tag))
                        __classPrivateFieldGet(this, _Scene_componentsByTag, "f").set(event.tag, new ComponentSet);
                    __classPrivateFieldGet(this, _Scene_componentsByTag, "f").get(event.tag).add(event.target);
                });
                ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
                    __classPrivateFieldGet(this, _Scene_componentsByTag, "f").get(event.tag)?.delete(event.target);
                });
            }
            /**
             * Adds a component to this scene.
             * @param component
             */
            addComponent(...components) {
                for (const c of components) {
                    this[Root].addComponent(c);
                }
                return this;
            }
            /**
             * Removes a component to this scene.
             * @param component
             * @returns `true` if the component was successfully added, `false` otherwise.
             */
            removeComponent(...components) {
                for (const c of components) {
                    this[Root].removeComponent(c);
                }
                return this;
            }
            /**
             * Returns all actors in the scene with the given tag.
             * @param tag
             */
            getComponentsByTag(tag) {
                const set = __classPrivateFieldGet(this, _Scene_componentsByTag, "f").get(tag);
                if (!set) {
                    const newSet = new ComponentSet();
                    __classPrivateFieldGet(this, _Scene_componentsByTag, "f").set(tag, newSet);
                    return newSet;
                }
                else
                    return set;
            }
            /**
             * Returns all actors in the scene with the given type.
             */
            getComponentsByType(type) {
                const set = __classPrivateFieldGet(this, _Scene_componentsByType, "f").get(type);
                if (!set) {
                    const newSet = new ComponentSet();
                    __classPrivateFieldGet(this, _Scene_componentsByType, "f").set(type, newSet);
                    return newSet;
                }
                else
                    return set;
            }
            /**
             * Returns the active camera in the scene (if one is set via ActiveCameraTag).
             * If multiple cameras are set as active, the first one found is returned.
             */
            getActiveCamera() { return this[ActiveCamera]; }
            onLoad() { }
            onCreate() { }
            onStart() { }
            onBeforePhysicsUpdate(delta, elapsed) { }
            onUpdate(delta, elapsed) { }
            onDestroy() { }
            destructor() {
                this[OnDestroy]();
            }
            async [(_Scene_grid = new WeakMap(), _Scene_ambientLight = new WeakMap(), _Scene_componentsByTag = new WeakMap(), _Scene_componentsByType = new WeakMap(), _Scene_allActors = new WeakMap(), _Scene_allBehaviors = new WeakMap(), _b = IsScene, _addComponent_decorators = [bound], _removeComponent_decorators = [bound], _getComponentsByTag_decorators = [bound], _getComponentsByType_decorators = [bound], _getActiveCamera_decorators = [bound], _member_decorators = [bound], _h = __propKey(OnLoad))]() {
                if (this[Internal].loaded || this[Internal].destroyed)
                    return;
                await Promise.all([this.onLoad(), this.physics?.init(this) ?? Promise.resolve()]);
                this[Internal].loaded = true;
                this[SceneLoadPromise].resolve();
            }
            [(_member_decorators_1 = [bound], _j = __propKey(OnCreate))]() {
                if (this[Internal].created || !this[Internal].loaded || this[Internal].destroyed)
                    return;
                this.object3d.add(__classPrivateFieldGet(this, _Scene_ambientLight, "f"));
                this.addComponent(__classPrivateFieldGet(this, _Scene_grid, "f"));
                this.grid.disable();
                this.onCreate();
                this[Root][Internal].app = this[App];
                this[Root][Internal].scene = this;
                this[Root][Internal].parent = null;
                this[Internal].created = true;
                this[Root][OnCreate]();
            }
            [(_member_decorators_2 = [bound], _k = __propKey(OnStart))]() {
                if (this[Internal].started || !this[Internal].created || this[Internal].destroyed)
                    return;
                this.physics?.start();
                this.onStart();
                this[Internal].started = true;
                this[Root][OnStart]();
            }
            [(_member_decorators_3 = [bound], _l = __propKey(OnBeforePhysicsUpdate))](delta, elapsed) {
                if (this[Internal].destroyed)
                    return;
                if (!this[Internal].started)
                    this[OnStart]();
                this.onBeforePhysicsUpdate(delta, elapsed);
                this[Root][OnBeforePhysicsUpdate](delta, elapsed);
            }
            [(_member_decorators_4 = [bound], _m = __propKey(OnUpdate))](delta, elapsed) {
                if (this[Internal].destroyed)
                    return;
                if (!this[Internal].started)
                    this[OnStart]();
                this.physics?.updatePhysicsWorld(this, delta, elapsed);
                this.onUpdate(delta, elapsed);
                this[Root][OnUpdate](delta, elapsed);
            }
            [(_member_decorators_5 = [bound], _o = __propKey(OnDestroy))]() {
                if (this[Internal].destroyed)
                    return;
                this[Root].destructor();
                this.onDestroy();
                __classPrivateFieldGet(this, _Scene_grid, "f").destructor();
                this.ambientLight.dispose();
                __classPrivateFieldGet(this, _Scene_componentsByTag, "f").clear();
                __classPrivateFieldGet(this, _Scene_componentsByType, "f").clear();
                this[App] = null;
                this[Internal].destroyed = true;
            }
        },
        _c = SceneLoadPromise,
        _d = ActiveCamera,
        _e = Root,
        _f = App,
        _g = Internal,
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(_a, null, _addComponent_decorators, { kind: "method", name: "addComponent", static: false, private: false, access: { has: obj => "addComponent" in obj, get: obj => obj.addComponent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _removeComponent_decorators, { kind: "method", name: "removeComponent", static: false, private: false, access: { has: obj => "removeComponent" in obj, get: obj => obj.removeComponent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getComponentsByTag_decorators, { kind: "method", name: "getComponentsByTag", static: false, private: false, access: { has: obj => "getComponentsByTag" in obj, get: obj => obj.getComponentsByTag }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getComponentsByType_decorators, { kind: "method", name: "getComponentsByType", static: false, private: false, access: { has: obj => "getComponentsByType" in obj, get: obj => obj.getComponentsByType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getActiveCamera_decorators, { kind: "method", name: "getActiveCamera", static: false, private: false, access: { has: obj => "getActiveCamera" in obj, get: obj => obj.getActiveCamera }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators, { kind: "method", name: _h, static: false, private: false, access: { has: obj => _h in obj, get: obj => obj[_h] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_1, { kind: "method", name: _j, static: false, private: false, access: { has: obj => _j in obj, get: obj => obj[_j] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_2, { kind: "method", name: _k, static: false, private: false, access: { has: obj => _k in obj, get: obj => obj[_k] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_3, { kind: "method", name: _l, static: false, private: false, access: { has: obj => _l in obj, get: obj => obj[_l] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_4, { kind: "method", name: _m, static: false, private: false, access: { has: obj => _m in obj, get: obj => obj[_m] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_5, { kind: "method", name: _o, static: false, private: false, access: { has: obj => _o in obj, get: obj => obj[_o] }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { Scene };
export class SceneActor extends Actor {
    constructor() {
        super();
        this.object3d = new Three.Scene;
    }
    onCreate() {
        console.log("huh?", this.object3d);
    }
}
