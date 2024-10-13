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
import { LogLevel } from "../Logging/Levels";
import { ASSERT, isDestroyable, isDev } from "./Asserts";
import { MouseIntersections } from "../Input/MouseIntersections";
import { ElysiaEventQueue } from "../Events/EventQueue";
import { InputQueue } from "../Input/InputQueue";
import { AssetLoader } from "../Assets/AssetLoader";
import { Profiler } from "./Profiler";
import { AudioPlayer } from "../Audio/AudioPlayer";
import { MouseObserver } from "../Input/Mouse";
import { BasicRenderPipeline } from "../RPipeline/BasicRenderPipeline";
import * as Three from "three";
import { ELYSIA_LOGGER } from "./Logger";
import { ResizeController, ResizeEvent } from "./Resize";
import { defaultScheduler } from "../UI/Scheduler";
import { ElysiaStats } from "../UI/ElysiaStats";
import { Internal, OnCreate, OnEnable, OnEnterScene, OnLoad, OnResize, OnStart, OnUpdate, SceneLoadPromise } from "./Internal";
import { bound } from "./Utilities";
let Application = (() => {
    let _instanceExtraInitializers = [];
    let _loadScene_decorators;
    let _destructor_decorators;
    let _update_decorators;
    return class Application {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _loadScene_decorators = [bound];
            _destructor_decorators = [bound];
            _update_decorators = [bound];
            __esDecorate(this, null, _loadScene_decorators, { kind: "method", name: "loadScene", static: false, private: false, access: { has: obj => "loadScene" in obj, get: obj => obj.loadScene }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _destructor_decorators, { kind: "method", name: "destructor", static: false, private: false, access: { has: obj => "destructor" in obj, get: obj => obj.destructor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * The application instance's event queue.
         */
        events = __runInitializers(this, _instanceExtraInitializers);
        /**
         * The application instance's mouse observer.
         */
        mouse;
        /**
         * The input queue for this application.
         */
        input = new InputQueue;
        /**
         * Application profiler instance.
         */
        profiler;
        /**
         * Applications audio player instance.
         */
        audio;
        /**
         * If this App should call Elysia UI's `defaultScheduler.update()` in it's update loop.
         */
        updateDefaultUiScheduler;
        /**
         * The maximum number of consecutive errors that can occur inside update() before stopping.
         */
        maxErrorCount = 10;
        /**
         * The active render pipeline.
         */
        get renderPipeline() { return this.#renderPipeline; }
        get assets() { return this.#assets; }
        constructor(config = {}) {
            this.loadScene = this.loadScene.bind(this);
            this.destructor = this.destructor.bind(this);
            this.update = this.update.bind(this);
            SET_ELYSIA_LOGLEVEL(config.logLevel ?? isDev() ? LogLevel.Debug : LogLevel.Production);
            this.events = config.eventQueue ?? new ElysiaEventQueue;
            this.profiler = config.profiler ?? new Profiler;
            this.audio = config.audio ?? new AudioPlayer;
            this.#assets = config.assets ?? new AssetLoader({});
            this.#renderPipeline = config.renderPipeline ?? new BasicRenderPipeline;
            this.#stats = config.stats ?? false;
            this.#output = config.output ?? document.createElement("canvas");
            if (!config.output) {
                ELYSIA_LOGGER.debug("No output canvas element provided, creating a new fullscreen one.");
                document.body.appendChild(this.#output);
                this.#output.style.width = "100%";
                this.#output.style.height = "100vh";
                this.#output.style.display = "block";
                this.#output.style.position = "relative";
                this.#output.style.margin = "0";
                this.#output.style.padding = "0";
            }
            // if config.output is undefined, we want the canvas sized to the window
            this.#resizeController = new ResizeController(config.output);
            this.#resizeController.addEventListener(ResizeEvent, () => this.#sizeHasChanged = true);
            this.mouse = new MouseObserver(this.#output);
            this.updateDefaultUiScheduler = config.updateDefaultUiScheduler ?? true;
            if (config.stats) {
                this.#stats = document.createElement("elysia-stats");
                this.#output.parentElement?.appendChild(this.#stats);
            }
        }
        async loadScene(scene) {
            ASSERT(this.renderPipeline &&
                this.#output &&
                scene);
            try {
                scene[Internal].app = this;
                this.#rendering = false;
                if (this.#scene) {
                    ELYSIA_LOGGER.debug("Unloading previous scene", this.#scene);
                    await this.#scene[SceneLoadPromise];
                    this.#scene.destructor?.();
                }
                await this.#assets?.load();
                this.#scene = scene;
                await this.#scene[OnLoad]();
                ELYSIA_LOGGER.debug("Scene loaded", scene);
                this.#renderPipeline.onCreate(this.#scene, this.#output);
                this.#renderPipeline.onResize(this.#resizeController.width, this.#resizeController.height);
                this.#scene[OnCreate]();
                this.#scene[OnResize](this.#output.clientWidth, this.#output.clientHeight);
                this.#scene[OnEnable]();
                this.#scene[OnStart]();
                this.#scene[OnEnterScene]();
                ELYSIA_LOGGER.debug("Scene started", scene);
                this.#sizeHasChanged = false;
                this.#rendering = true;
            }
            catch (e) {
                ELYSIA_LOGGER.error(e);
                return;
            }
            this.update();
        }
        destructor() {
            ELYSIA_LOGGER.debug("Destroying application");
            this.#rendering = false;
            for (const prop of Object.values(this))
                if (isDestroyable(prop))
                    prop.destructor();
        }
        update() {
            try {
                if (!this.#scene || !this.#rendering)
                    throw Error("No scene loaded");
                if (this.#errorCount <= this.maxErrorCount)
                    requestAnimationFrame(this.update);
                else {
                    ELYSIA_LOGGER.critical("Too many consecutive errors, stopping update loop.");
                    return;
                }
                const delta = this.#clock.getDelta() || 0.016;
                const elapsed = this.#clock.getElapsedTime();
                // update mouse intersection
                this.#mouseIntersectionController.cast(this.#scene.getActiveCamera(), this.#scene.object3d, this.mouse.x / this.#output.clientWidth * 2 - 1, this.mouse.y / this.#output.clientHeight * 2 - 1);
                // flush input and event queue callbacks
                this.input.flush();
                this.events.flush();
                // update stats
                if (this.#stats instanceof ElysiaStats) {
                    this.renderPipeline.getRenderer().info.autoReset = false;
                    this.#stats.stats.fps = Math.round(1 / delta);
                    this.#stats.stats.calls = this.renderPipeline.getRenderer().info.render.calls;
                    this.#stats.stats.lines = this.renderPipeline.getRenderer().info.render.lines;
                    this.#stats.stats.points = this.renderPipeline.getRenderer().info.render.points;
                    this.#stats.stats.triangles = this.renderPipeline.getRenderer().info.render.triangles;
                    this.#stats.stats.memory = this.renderPipeline.getRenderer().info.memory.geometries + this.renderPipeline.getRenderer().info.memory.textures;
                    this.#renderPipeline.getRenderer().info.reset();
                }
                if (this.#sizeHasChanged) {
                    console.log(this.#resizeController.width, this.#resizeController.height);
                    this.#scene[OnResize](this.#resizeController.width, this.#resizeController.height);
                    this.#renderPipeline.onResize(this.#resizeController.width, this.#resizeController.height);
                    this.#sizeHasChanged = false;
                }
                // scene update
                this.#scene[OnUpdate](delta, elapsed);
                // scene render
                this.#renderPipeline?.onRender(this.#scene, this.#scene.getActiveCamera());
                // update default UI scheduler
                this.updateDefaultUiScheduler && defaultScheduler.update();
                // clear input and event queues
                this.input.clear();
                this.events.clear();
                this.#errorCount = 0;
            }
            catch (e) {
                ELYSIA_LOGGER.error(e);
                this.#errorCount++;
            }
        }
        #resizeController;
        #sizeHasChanged = false;
        #assets;
        #mouseIntersectionController = new MouseIntersections;
        #errorCount = 0;
        #stats = false;
        #clock = new Three.Clock;
        #renderPipeline;
        #output;
        #scene;
        #rendering = false;
    };
})();
export { Application };
