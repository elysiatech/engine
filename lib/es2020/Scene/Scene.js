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
import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { GridActor } from "../Actors/GridActor.js";
import { SparseSet } from "../Containers/SparseSet.js";
import { ActiveCamera, Internal, OnLoad, SceneLoadPromise } from "../Core/Internal.js";
export const IsScene = Symbol.for("Elysia::IsScene");
let Scene = (() => {
    var _a, _Scene_grid, _Scene_ambientLight, _Scene_componentsByTag, _Scene_componentsByType, _Scene_allActors, _Scene_allBehaviors, _b, _c, _d;
    var _e;
    let _classSuper = Actor;
    let _instanceExtraInitializers = [];
    let _getComponentsByTag_decorators;
    let _getComponentsByType_decorators;
    let _getActiveCamera_decorators;
    let _onLoad_decorators;
    let _onCreate_decorators;
    let _onStart_decorators;
    let _onUpdate_decorators;
    let _onEnd_decorators;
    let _member_decorators;
    return _a = class Scene extends _classSuper {
            get grid() { return __classPrivateFieldGet(this, _Scene_grid, "f"); }
            get ambientLight() { return __classPrivateFieldGet(this, _Scene_ambientLight, "f"); }
            get activeCamera() { return this.getActiveCamera(); }
            set activeCamera(camera) {
                this[ActiveCamera] = camera instanceof Actor ? camera.object3d : camera;
                this.app?.renderPipeline.onCameraChange(this[ActiveCamera]);
            }
            constructor() {
                super();
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
                _Scene_grid.set(this, new GridActor);
                _Scene_ambientLight.set(this, new Three.AmbientLight(0xffffff, 0.5));
                _Scene_componentsByTag.set(this, new Map);
                _Scene_componentsByType.set(this, new Map);
                _Scene_allActors.set(this, new SparseSet);
                _Scene_allBehaviors.set(this, new SparseSet);
                this.object3d = this[Internal].object3d = new Three.Scene();
                this[Internal].scene = this;
                ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {
                    const type = e.child.constructor;
                    if (!__classPrivateFieldGet(this, _Scene_componentsByType, "f").has(type))
                        __classPrivateFieldGet(this, _Scene_componentsByType, "f").set(type, new SparseSet);
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
                });
                ElysiaEventDispatcher.addEventListener(TagAddedEvent, (event) => {
                    if (!__classPrivateFieldGet(this, _Scene_componentsByTag, "f").has(event.tag))
                        __classPrivateFieldGet(this, _Scene_componentsByTag, "f").set(event.tag, new SparseSet);
                    __classPrivateFieldGet(this, _Scene_componentsByTag, "f").get(event.tag).add(event.target);
                });
                ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
                    __classPrivateFieldGet(this, _Scene_componentsByTag, "f").get(event.tag)?.delete(event.target);
                });
            }
            /**
             * Returns all actors in the scene with the given tag.
             * @param tag
             */
            getComponentsByTag(tag) {
                return __classPrivateFieldGet(this, _Scene_componentsByTag, "f").get(tag) || new SparseSet;
            }
            /**
             * Returns all actors in the scene with the given type.
             */
            getComponentsByType(type) {
                return __classPrivateFieldGet(this, _Scene_componentsByType, "f").get(type) || new SparseSet;
            }
            /**
             * Returns the active camera in the scene (if one is set via ActiveCameraTag).
             * If multiple cameras are set as active, the first one found is returned.
             */
            getActiveCamera() {
                return this[ActiveCamera];
            }
            onLoad() { }
            onCreate() {
                ELYSIA_LOGGER.debug("Scene created", this);
                this.object3d.add(__classPrivateFieldGet(this, _Scene_ambientLight, "f"));
                __classPrivateFieldGet(this, _Scene_grid, "f").disable();
                this.addComponent(__classPrivateFieldGet(this, _Scene_grid, "f"));
            }
            onStart() {
                super.onStart();
                this.physics?.start();
            }
            onUpdate(delta, elapsed) {
                super.onUpdate(delta, elapsed);
                const t = performance.now();
                this.physics?.updatePhysicsWorld(this, delta, elapsed);
                // console.log("Physics update time", performance.now() - t)
            }
            onEnd() {
                __classPrivateFieldGet(this, _Scene_componentsByTag, "f").clear();
                __classPrivateFieldGet(this, _Scene_componentsByType, "f").clear();
            }
            async [(_Scene_grid = new WeakMap(), _Scene_ambientLight = new WeakMap(), _Scene_componentsByTag = new WeakMap(), _Scene_componentsByType = new WeakMap(), _Scene_allActors = new WeakMap(), _Scene_allBehaviors = new WeakMap(), _b = IsScene, _getComponentsByTag_decorators = [bound], _getComponentsByType_decorators = [bound], _getActiveCamera_decorators = [bound], _onLoad_decorators = [bound], _onCreate_decorators = [bound], _onStart_decorators = [bound], _onUpdate_decorators = [bound], _onEnd_decorators = [bound], _member_decorators = [bound], _e = __propKey(OnLoad))]() {
                await Promise.all([this.onLoad(), this.physics?.init(this) ?? Promise.resolve()]);
                this[SceneLoadPromise].resolve();
            }
        },
        _c = SceneLoadPromise,
        _d = ActiveCamera,
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(_a, null, _getComponentsByTag_decorators, { kind: "method", name: "getComponentsByTag", static: false, private: false, access: { has: obj => "getComponentsByTag" in obj, get: obj => obj.getComponentsByTag }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getComponentsByType_decorators, { kind: "method", name: "getComponentsByType", static: false, private: false, access: { has: obj => "getComponentsByType" in obj, get: obj => obj.getComponentsByType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getActiveCamera_decorators, { kind: "method", name: "getActiveCamera", static: false, private: false, access: { has: obj => "getActiveCamera" in obj, get: obj => obj.getActiveCamera }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onLoad_decorators, { kind: "method", name: "onLoad", static: false, private: false, access: { has: obj => "onLoad" in obj, get: obj => obj.onLoad }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onCreate_decorators, { kind: "method", name: "onCreate", static: false, private: false, access: { has: obj => "onCreate" in obj, get: obj => obj.onCreate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onStart_decorators, { kind: "method", name: "onStart", static: false, private: false, access: { has: obj => "onStart" in obj, get: obj => obj.onStart }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onUpdate_decorators, { kind: "method", name: "onUpdate", static: false, private: false, access: { has: obj => "onUpdate" in obj, get: obj => obj.onUpdate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onEnd_decorators, { kind: "method", name: "onEnd", static: false, private: false, access: { has: obj => "onEnd" in obj, get: obj => obj.onEnd }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators, { kind: "method", name: _e, static: false, private: false, access: { has: obj => _e in obj, get: obj => obj[_e] }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { Scene };
