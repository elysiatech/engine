import { LogLevel } from "../Logging/Levels";
import { ASSERT, isDestroyable, isDev } from "./Asserts";
import { MouseIntersections } from "../Input/MouseIntersections";
import { ElysiaEventQueue } from "../Events/EventQueue";
import { InputQueue } from "../Input/InputQueue";
import { AssetLoader } from "../Assets/AssetLoader.ts";
import { Profiler } from "./Profiler";
import { AudioPlayer } from "../Audio/AudioPlayer";
import { MouseObserver } from "../Input/Mouse";
import { Scene } from "../Scene/Scene";
import { RenderPipeline } from "../RPipeline/RenderPipeline";
import { BasicRenderPipeline } from "../RPipeline/BasicRenderPipeline";
import * as Three from "three";
import { ELYSIA_LOGGER } from "./Logger";
import { ResizeController, ResizeEvent } from "./Resize";
import { defaultScheduler } from "../UI/Scheduler";
import { ElysiaStats } from "../UI/ElysiaStats";
import { Actor } from "../Scene/Actor.ts";
import {
	Internal,
	OnCreate,
	OnEnable,
	OnEnterScene,
	OnLoad,
	OnResize,
	OnStart,
	OnUpdate,
	SceneLoadPromise
} from "./Internal.ts";
import { bound } from "./Utilities.ts";

declare module 'three'
{
	export interface Object3D
	{
		actor?: Actor<any>;
	}
}

interface ApplicationConstructorArguments
{
	output?: HTMLCanvasElement,
	logLevel?: LogLevel,
	eventQueue?: ElysiaEventQueue,
	profiler?: Profiler,
	assets?: AssetLoader<any>,
	audio?: AudioPlayer
	renderPipeline?: RenderPipeline
	stats?: boolean
	updateDefaultUiScheduler?: boolean
}

export class Application {

	/**
	 * The application instance's event queue.
	 */
	public readonly events: ElysiaEventQueue;

	/**
	 * The application instance's mouse observer.
	 */
	public readonly mouse: MouseObserver;
	
	/**
	 * The input queue for this application.
	 */
	public readonly input = new InputQueue;

	/**
	 * Application profiler instance.
	 */
	public readonly profiler: Profiler;

	/**
	 * Applications audio player instance.
	 */
	public readonly audio: AudioPlayer;

	/**
	 * If this App should call Elysia UI's `defaultScheduler.update()` in it's update loop.
	 */
	public updateDefaultUiScheduler: boolean;

	/**
	 * The maximum number of consecutive errors that can occur inside update() before stopping.
	 */
	public maxErrorCount = 10;

	/**
	 * The active render pipeline.
	 */
	public get renderPipeline() { return this.#renderPipeline!; }

	get assets() { return this.#assets; }

	constructor(config: ApplicationConstructorArguments = {})
	{
		this.loadScene = this.loadScene.bind(this)
		this.destructor = this.destructor.bind(this)
		this.update = this.update.bind(this)

		SET_ELYSIA_LOGLEVEL(config.logLevel ?? isDev() ? LogLevel.Debug : LogLevel.Production)

		this.events = config.eventQueue ?? new ElysiaEventQueue
		this.profiler = config.profiler ?? new Profiler
		this.audio = config.audio ?? new AudioPlayer
		this.#assets = config.assets ?? new AssetLoader({});
		this.#renderPipeline = config.renderPipeline ?? new BasicRenderPipeline;
		this.#stats = config.stats ?? false;
		this.#output = config.output ?? document.createElement("canvas");

		if(!config.output)
		{
			ELYSIA_LOGGER.debug("No output canvas element provided, creating a new fullscreen one.")
			document.body.appendChild(this.#output)
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

		if(config.stats)
		{
			this.#stats = document.createElement("elysia-stats") as ElysiaStats;
			this.#output.parentElement?.appendChild(this.#stats);
		}
	}

	@bound public async loadScene(scene: Scene)
	{
		ASSERT(
			this.renderPipeline &&
			this.#output &&
			scene,
		)

		try
		{
			scene[Internal].app = this;

			this.#rendering = false;

			if(this.#scene)
			{
				ELYSIA_LOGGER.debug("Unloading previous scene", this.#scene)
				await this.#scene[SceneLoadPromise];
				this.#scene.destructor?.();
			}

			await this.#assets?.load();

			this.#scene = scene
			await this.#scene[OnLoad]();

			ELYSIA_LOGGER.debug("Scene loaded", scene)

			this.#renderPipeline!.onCreate(this.#scene, this.#output);
			this.#renderPipeline!.onResize(this.#resizeController.width, this.#resizeController.height);

			this.#scene[OnCreate]();
			this.#scene[OnResize](this.#output.clientWidth, this.#output.clientHeight);
			this.#scene[OnEnable]();
			this.#scene[OnStart]();
			this.#scene[OnEnterScene]();

			ELYSIA_LOGGER.debug("Scene started", scene)

			this.#sizeHasChanged = false;

			this.#rendering = true;
		}
		catch(e)
		{
			ELYSIA_LOGGER.error(e)
			return;
		}

		this.update();
	}

	@bound public destructor()
	{
		ELYSIA_LOGGER.debug("Destroying application")
		this.#rendering = false;

		for(const prop of Object.values(this)) if(isDestroyable(prop)) prop.destructor()
	}

	@bound private update()
	{
		try {
			if(!this.#scene || !this.#rendering) throw Error("No scene loaded")

			if(this.#errorCount <= this.maxErrorCount) requestAnimationFrame(this.update);

			else
			{
				ELYSIA_LOGGER.critical("Too many consecutive errors, stopping update loop.")
				return;
			}

			const delta = this.#clock.getDelta() || 0.016;
			const elapsed = this.#clock.getElapsedTime();

			// update mouse intersection
			this.#mouseIntersectionController.cast(
				this.#scene.getActiveCamera(),
				this.#scene.object3d,
				this.mouse.x / this.#output.clientWidth * 2 -1,
				this.mouse.y / this.#output.clientHeight * 2 -1
			);

			// flush input and event queue callbacks
			this.input.flush();
			this.events.flush();

			// update stats
			if(this.#stats instanceof ElysiaStats)
			{
				this.renderPipeline!.getRenderer().info.autoReset = false;
				this.#stats.stats.fps = Math.round(1 / delta);
				this.#stats.stats.calls = this.renderPipeline!.getRenderer().info.render.calls;
				this.#stats.stats.lines = this.renderPipeline!.getRenderer().info.render.lines;
				this.#stats.stats.points = this.renderPipeline!.getRenderer().info.render.points;
				this.#stats.stats.triangles = this.renderPipeline!.getRenderer().info.render.triangles;
				this.#stats.stats.memory = this.renderPipeline!.getRenderer().info.memory.geometries + this.renderPipeline!.getRenderer().info.memory.textures;
				this.#renderPipeline!.getRenderer().info.reset();
			}

			if(this.#sizeHasChanged)
			{
				console.log(this.#resizeController.width, this.#resizeController.height)
				this.#scene[OnResize](this.#resizeController.width, this.#resizeController.height);
				this.#renderPipeline!.onResize(this.#resizeController.width, this.#resizeController.height);
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
		catch(e)
		{
			ELYSIA_LOGGER.error(e)
			this.#errorCount++;
		}
	}

	#resizeController: ResizeController;
	#sizeHasChanged = false;
	#assets: AssetLoader<any>;
	#mouseIntersectionController = new MouseIntersections;
	#errorCount = 0;
	#stats: boolean | ElysiaStats = false;
	#clock = new Three.Clock;
	#renderPipeline?: RenderPipeline;
	#output: HTMLCanvasElement;
	#scene?: Scene;
	#rendering = false;
}