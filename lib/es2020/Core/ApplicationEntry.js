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
import { LogLevel } from "../Logging/Levels.js";
import { ASSERT, isDestroyable, isDev } from "./Asserts.js";
import { MouseIntersections } from "../Input/MouseIntersections.js";
import { ElysiaEventQueue } from "../Events/EventQueue.js";
import { InputQueue } from "../Input/InputQueue.js";
import { AssetLoader } from "../Assets/AssetLoader.js";
import { Profiler } from "./Profiler.js";
import { AudioPlayer } from "../Audio/AudioPlayer.js";
import { MouseObserver } from "../Input/Mouse.js";
import { BasicRenderPipeline } from "../RPipeline/BasicRenderPipeline.js";
import * as Three from "three";
import { ELYSIA_LOGGER } from "./Logger.js";
import { ResizeController, ResizeEvent } from "./Resize.js";
import { defaultScheduler } from "../UI/Scheduler.js";
import { ElysiaStats } from "../UI/ElysiaStats.js";
import { Internal, OnCreate, OnEnable, OnEnterScene, OnLoad, OnResize, OnStart, OnUpdate, SceneLoadPromise } from "./Internal.js";
import { bound } from "./Utilities.js";
let Application = (() => {
    var _a, _Application_resizeController, _Application_sizeHasChanged, _Application_assets, _Application_mouseIntersectionController, _Application_errorCount, _Application_stats, _Application_clock, _Application_renderPipeline, _Application_output, _Application_scene, _Application_rendering;
    let _instanceExtraInitializers = [];
    let _loadScene_decorators;
    let _destructor_decorators;
    let _update_decorators;
    return _a = class Application {
            /**
             * The active render pipeline.
             */
            get renderPipeline() { return __classPrivateFieldGet(this, _Application_renderPipeline, "f"); }
            get assets() { return __classPrivateFieldGet(this, _Application_assets, "f"); }
            constructor(config = {}) {
                /**
                 * The application instance's event queue.
                 */
                Object.defineProperty(this, "events", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: __runInitializers(this, _instanceExtraInitializers)
                });
                /**
                 * The application instance's mouse observer.
                 */
                Object.defineProperty(this, "mouse", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                /**
                 * The input queue for this application.
                 */
                Object.defineProperty(this, "input", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: new InputQueue
                });
                /**
                 * Application profiler instance.
                 */
                Object.defineProperty(this, "profiler", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                /**
                 * Applications audio player instance.
                 */
                Object.defineProperty(this, "audio", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                /**
                 * If this App should call Elysia UI's `defaultScheduler.update()` in it's update loop.
                 */
                Object.defineProperty(this, "updateDefaultUiScheduler", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                /**
                 * The maximum number of consecutive errors that can occur inside update() before stopping.
                 */
                Object.defineProperty(this, "maxErrorCount", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: 10
                });
                _Application_resizeController.set(this, void 0);
                _Application_sizeHasChanged.set(this, false);
                _Application_assets.set(this, void 0);
                _Application_mouseIntersectionController.set(this, new MouseIntersections);
                _Application_errorCount.set(this, 0);
                _Application_stats.set(this, false);
                _Application_clock.set(this, new Three.Clock);
                _Application_renderPipeline.set(this, void 0);
                _Application_output.set(this, void 0);
                _Application_scene.set(this, void 0);
                _Application_rendering.set(this, false);
                this.loadScene = this.loadScene.bind(this);
                this.destructor = this.destructor.bind(this);
                this.update = this.update.bind(this);
                SET_ELYSIA_LOGLEVEL(config.logLevel ?? isDev() ? LogLevel.Debug : LogLevel.Production);
                this.events = config.eventQueue ?? new ElysiaEventQueue;
                this.profiler = config.profiler ?? new Profiler;
                this.audio = config.audio ?? new AudioPlayer;
                __classPrivateFieldSet(this, _Application_assets, config.assets ?? new AssetLoader({}), "f");
                __classPrivateFieldSet(this, _Application_renderPipeline, config.renderPipeline ?? new BasicRenderPipeline, "f");
                __classPrivateFieldSet(this, _Application_stats, config.stats ?? false, "f");
                __classPrivateFieldSet(this, _Application_output, config.output ?? document.createElement("canvas"), "f");
                if (!config.output) {
                    ELYSIA_LOGGER.debug("No output canvas element provided, creating a new fullscreen one.");
                    document.body.appendChild(__classPrivateFieldGet(this, _Application_output, "f"));
                    __classPrivateFieldGet(this, _Application_output, "f").style.width = "100%";
                    __classPrivateFieldGet(this, _Application_output, "f").style.height = "100vh";
                    __classPrivateFieldGet(this, _Application_output, "f").style.display = "block";
                    __classPrivateFieldGet(this, _Application_output, "f").style.position = "relative";
                    __classPrivateFieldGet(this, _Application_output, "f").style.margin = "0";
                    __classPrivateFieldGet(this, _Application_output, "f").style.padding = "0";
                }
                // if config.output is undefined, we want the canvas sized to the window
                __classPrivateFieldSet(this, _Application_resizeController, new ResizeController(config.output), "f");
                __classPrivateFieldGet(this, _Application_resizeController, "f").addEventListener(ResizeEvent, () => __classPrivateFieldSet(this, _Application_sizeHasChanged, true, "f"));
                this.mouse = new MouseObserver(__classPrivateFieldGet(this, _Application_output, "f"));
                this.updateDefaultUiScheduler = config.updateDefaultUiScheduler ?? true;
                if (config.stats) {
                    __classPrivateFieldSet(this, _Application_stats, document.createElement("elysia-stats"), "f");
                    __classPrivateFieldGet(this, _Application_output, "f").parentElement?.appendChild(__classPrivateFieldGet(this, _Application_stats, "f"));
                }
            }
            async loadScene(scene) {
                ASSERT(this.renderPipeline &&
                    __classPrivateFieldGet(this, _Application_output, "f") &&
                    scene);
                try {
                    scene[Internal].app = this;
                    __classPrivateFieldSet(this, _Application_rendering, false, "f");
                    if (__classPrivateFieldGet(this, _Application_scene, "f")) {
                        ELYSIA_LOGGER.debug("Unloading previous scene", __classPrivateFieldGet(this, _Application_scene, "f"));
                        await __classPrivateFieldGet(this, _Application_scene, "f")[SceneLoadPromise];
                        __classPrivateFieldGet(this, _Application_scene, "f").destructor?.();
                    }
                    await __classPrivateFieldGet(this, _Application_assets, "f")?.load();
                    __classPrivateFieldSet(this, _Application_scene, scene, "f");
                    await __classPrivateFieldGet(this, _Application_scene, "f")[OnLoad]();
                    ELYSIA_LOGGER.debug("Scene loaded", scene);
                    __classPrivateFieldGet(this, _Application_renderPipeline, "f").onCreate(__classPrivateFieldGet(this, _Application_scene, "f"), __classPrivateFieldGet(this, _Application_output, "f"));
                    __classPrivateFieldGet(this, _Application_renderPipeline, "f").onResize(__classPrivateFieldGet(this, _Application_resizeController, "f").width, __classPrivateFieldGet(this, _Application_resizeController, "f").height);
                    __classPrivateFieldGet(this, _Application_scene, "f")[OnCreate]();
                    __classPrivateFieldGet(this, _Application_scene, "f")[OnResize](__classPrivateFieldGet(this, _Application_output, "f").clientWidth, __classPrivateFieldGet(this, _Application_output, "f").clientHeight);
                    __classPrivateFieldGet(this, _Application_scene, "f")[OnEnable]();
                    __classPrivateFieldGet(this, _Application_scene, "f")[OnStart]();
                    __classPrivateFieldGet(this, _Application_scene, "f")[OnEnterScene]();
                    ELYSIA_LOGGER.debug("Scene started", scene);
                    __classPrivateFieldSet(this, _Application_sizeHasChanged, false, "f");
                    __classPrivateFieldSet(this, _Application_rendering, true, "f");
                }
                catch (e) {
                    ELYSIA_LOGGER.error(e);
                    return;
                }
                this.update();
            }
            destructor() {
                ELYSIA_LOGGER.debug("Destroying application");
                __classPrivateFieldSet(this, _Application_rendering, false, "f");
                for (const prop of Object.values(this))
                    if (isDestroyable(prop))
                        prop.destructor();
            }
            update() {
                var _b;
                try {
                    if (!__classPrivateFieldGet(this, _Application_scene, "f") || !__classPrivateFieldGet(this, _Application_rendering, "f"))
                        throw Error("No scene loaded");
                    if (__classPrivateFieldGet(this, _Application_errorCount, "f") <= this.maxErrorCount)
                        requestAnimationFrame(this.update);
                    else {
                        ELYSIA_LOGGER.critical("Too many consecutive errors, stopping update loop.");
                        return;
                    }
                    const delta = __classPrivateFieldGet(this, _Application_clock, "f").getDelta() || 0.016;
                    const elapsed = __classPrivateFieldGet(this, _Application_clock, "f").getElapsedTime();
                    // update mouse intersection
                    __classPrivateFieldGet(this, _Application_mouseIntersectionController, "f").cast(__classPrivateFieldGet(this, _Application_scene, "f").getActiveCamera(), __classPrivateFieldGet(this, _Application_scene, "f").object3d, this.mouse.x / __classPrivateFieldGet(this, _Application_output, "f").clientWidth * 2 - 1, this.mouse.y / __classPrivateFieldGet(this, _Application_output, "f").clientHeight * 2 - 1);
                    // flush input and event queue callbacks
                    this.input.flush();
                    this.events.flush();
                    // update stats
                    if (__classPrivateFieldGet(this, _Application_stats, "f") instanceof ElysiaStats) {
                        this.renderPipeline.getRenderer().info.autoReset = false;
                        __classPrivateFieldGet(this, _Application_stats, "f").stats.fps = Math.round(1 / delta);
                        __classPrivateFieldGet(this, _Application_stats, "f").stats.calls = this.renderPipeline.getRenderer().info.render.calls;
                        __classPrivateFieldGet(this, _Application_stats, "f").stats.lines = this.renderPipeline.getRenderer().info.render.lines;
                        __classPrivateFieldGet(this, _Application_stats, "f").stats.points = this.renderPipeline.getRenderer().info.render.points;
                        __classPrivateFieldGet(this, _Application_stats, "f").stats.triangles = this.renderPipeline.getRenderer().info.render.triangles;
                        __classPrivateFieldGet(this, _Application_stats, "f").stats.memory = this.renderPipeline.getRenderer().info.memory.geometries + this.renderPipeline.getRenderer().info.memory.textures;
                        __classPrivateFieldGet(this, _Application_renderPipeline, "f").getRenderer().info.reset();
                    }
                    if (__classPrivateFieldGet(this, _Application_sizeHasChanged, "f")) {
                        console.log(__classPrivateFieldGet(this, _Application_resizeController, "f").width, __classPrivateFieldGet(this, _Application_resizeController, "f").height);
                        __classPrivateFieldGet(this, _Application_scene, "f")[OnResize](__classPrivateFieldGet(this, _Application_resizeController, "f").width, __classPrivateFieldGet(this, _Application_resizeController, "f").height);
                        __classPrivateFieldGet(this, _Application_renderPipeline, "f").onResize(__classPrivateFieldGet(this, _Application_resizeController, "f").width, __classPrivateFieldGet(this, _Application_resizeController, "f").height);
                        __classPrivateFieldSet(this, _Application_sizeHasChanged, false, "f");
                    }
                    // scene update
                    __classPrivateFieldGet(this, _Application_scene, "f")[OnUpdate](delta, elapsed);
                    // scene render
                    __classPrivateFieldGet(this, _Application_renderPipeline, "f")?.onRender(__classPrivateFieldGet(this, _Application_scene, "f"), __classPrivateFieldGet(this, _Application_scene, "f").getActiveCamera());
                    // update default UI scheduler
                    this.updateDefaultUiScheduler && defaultScheduler.update();
                    // clear input and event queues
                    this.input.clear();
                    this.events.clear();
                    __classPrivateFieldSet(this, _Application_errorCount, 0, "f");
                }
                catch (e) {
                    ELYSIA_LOGGER.error(e);
                    __classPrivateFieldSet(this, _Application_errorCount, (_b = __classPrivateFieldGet(this, _Application_errorCount, "f"), _b++, _b), "f");
                }
            }
        },
        _Application_resizeController = new WeakMap(),
        _Application_sizeHasChanged = new WeakMap(),
        _Application_assets = new WeakMap(),
        _Application_mouseIntersectionController = new WeakMap(),
        _Application_errorCount = new WeakMap(),
        _Application_stats = new WeakMap(),
        _Application_clock = new WeakMap(),
        _Application_renderPipeline = new WeakMap(),
        _Application_output = new WeakMap(),
        _Application_scene = new WeakMap(),
        _Application_rendering = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _loadScene_decorators = [bound];
            _destructor_decorators = [bound];
            _update_decorators = [bound];
            __esDecorate(_a, null, _loadScene_decorators, { kind: "method", name: "loadScene", static: false, private: false, access: { has: obj => "loadScene" in obj, get: obj => obj.loadScene }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _destructor_decorators, { kind: "method", name: "destructor", static: false, private: false, access: { has: obj => "destructor" in obj, get: obj => obj.destructor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { Application };
