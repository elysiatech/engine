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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
import { bound } from "../Core/Utilities.js";
/**
 * A model actor is an actor that represents a 3D model, usually loaded from a GLTF file.
 */
let ModelActor = (() => {
    var _a, _ModelActor_debug, _ModelActor_debugHelper;
    let _classSuper = Actor;
    let _instanceExtraInitializers = [];
    let _getAction_decorators;
    let _loadModel_decorators;
    let _onUpdate_decorators;
    return _a = class ModelActor extends _classSuper {
            /**
             * Should this model cast shadows?
             */
            get castShadow() { return this.object3d.castShadow; }
            set castShadow(value) { this.object3d.castShadow = value; this.object3d.traverse(x => x.castShadow = value); }
            /**
             * Should this model receive shadows?
             */
            get receiveShadow() { return this.object3d.receiveShadow; }
            set receiveShadow(value) { this.object3d.receiveShadow = value; }
            /**
             * A debug flag that will show a bounding box around the model.
             */
            get debug() { return __classPrivateFieldGet(this, _ModelActor_debug, "f"); }
            set debug(value) {
                if (value) {
                    __classPrivateFieldSet(this, _ModelActor_debugHelper, __classPrivateFieldGet(this, _ModelActor_debugHelper, "f") ?? new Three.BoxHelper(this.object3d, "red"), "f");
                    this.object3d.add(__classPrivateFieldGet(this, _ModelActor_debugHelper, "f"));
                }
                else {
                    __classPrivateFieldGet(this, _ModelActor_debugHelper, "f")?.parent?.remove(__classPrivateFieldGet(this, _ModelActor_debugHelper, "f"));
                    __classPrivateFieldGet(this, _ModelActor_debugHelper, "f")?.dispose();
                    __classPrivateFieldSet(this, _ModelActor_debugHelper, undefined, "f");
                }
                __classPrivateFieldSet(this, _ModelActor_debug, value, "f");
            }
            constructor(model) {
                super();
                Object.defineProperty(this, "type", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: (__runInitializers(this, _instanceExtraInitializers), "ModelActor")
                });
                Object.defineProperty(this, "clips", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: []
                });
                Object.defineProperty(this, "mixer", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                _ModelActor_debug.set(this, false);
                _ModelActor_debugHelper.set(this, void 0);
                this.loadModel(model);
            }
            getAction(name) {
                const clip = Three.AnimationClip.findByName(this.clips, name);
                return this.mixer?.clipAction(clip);
            }
            loadModel(model) {
                const clips = model?.animations ?? [];
                const scene = model?.scene ?? model?.scenes[0];
                this.object3d = scene ?? new Three.Group();
                this.clips = clips;
                if (this.mixer) {
                    this.mixer.stopAllAction();
                    this.mixer.uncacheRoot(this.mixer.getRoot());
                    this.mixer = undefined;
                }
                if (clips.length > 0) {
                    this.mixer = new Three.AnimationMixer(this.object3d);
                }
            }
            onUpdate(delta, elapsed) {
                this.mixer?.update(delta);
            }
        },
        _ModelActor_debug = new WeakMap(),
        _ModelActor_debugHelper = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getAction_decorators = [bound];
            _loadModel_decorators = [bound];
            _onUpdate_decorators = [bound];
            __esDecorate(_a, null, _getAction_decorators, { kind: "method", name: "getAction", static: false, private: false, access: { has: obj => "getAction" in obj, get: obj => obj.getAction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _loadModel_decorators, { kind: "method", name: "loadModel", static: false, private: false, access: { has: obj => "loadModel" in obj, get: obj => obj.loadModel }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onUpdate_decorators, { kind: "method", name: "onUpdate", static: false, private: false, access: { has: obj => "onUpdate" in obj, get: obj => obj.onUpdate }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ModelActor };
