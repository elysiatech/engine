import { LogLevel } from "../Logging/Levels";
import { isDestroyable, isDev } from "./Asserts";
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
import { ResizeController } from "./Resize";
import { defaultScheduler } from "../UI/Scheduler";
import { ElysiaStats } from "../UI/ElysiaStats";

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

	constructor(config: ApplicationConstructorArguments = {})
	{
		this.loadScene = this.loadScene.bind(this)
		this.destructor = this.destructor.bind(this)
		this.update = this.update.bind(this)

		SET_ELYSIA_LOGLEVEL(config.logLevel ?? isDev() ? LogLevel.Debug : LogLevel.Production)

		this.events = config.eventQueue ?? new ElysiaEventQueue
		this.profiler = config.profiler ?? new Profiler
		this.audio = config.audio ?? new AudioPlayer

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
			this.#output.style.margin = "0";
			this.#output.style.padding = "0";
			this.#output.style.position = "relative";
		}

		this.mouse = new MouseObserver(this.#output);

		this.#resizeController = new ResizeController();

		this.updateDefaultUiScheduler = config.updateDefaultUiScheduler ?? true;

		if(config.stats)
		{
			this.#stats = document.createElement("elysia-stats") as ElysiaStats;
			this.#output.parentElement?.appendChild(this.#stats);
		}
	}

	public async loadScene(scene: Scene)
	{
		ELYSIA_LOGGER.debug("Loading scene", scene)
		scene.app = this;
		this.#rendering = false;
		if(this.#scene)
		{
			ELYSIA_LOGGER.debug("Unloading previous scene", this.#scene)
			await this.#scene.loadPromise;
			this.#scene.destructor?.();
		}
		this.#scene = scene
		await this.#scene?._load();
		ELYSIA_LOGGER.debug("Scene loaded", scene)
		this.#renderPipeline!.onCreate(this.#scene, this.#output);
		this.#renderPipeline!.onResize(this.#output.clientWidth, this.#output.clientHeight);
		this.#scene._onCreate();
		this.#scene._onEnable();
		this.#scene._onStart();
		this.#scene._onEnterScene();
		ELYSIA_LOGGER.debug("Scene started", scene)
		this.#rendering = true;
		this.update();
	}

	public destructor()
	{
		ELYSIA_LOGGER.debug("Destroying application")
		this.#rendering = false;
		for(const prop of Object.values(this))
		{
			if(isDestroyable(prop))
			{
				prop.destructor()
			}
		}
	}

	private update()
	{
		try {
			if(!this.#scene || !this.#rendering)
			{
				throw Error("No scene loaded")
			}

			if(this.#errorCount <= this.maxErrorCount)
			{
				requestAnimationFrame(this.update);
			}
			else
			{
				ELYSIA_LOGGER.critical("Too many consecutive errors, stopping update loop.")
				return;
			}

			const camera = this.#scene.getActiveCamera();

			if(!camera)
			{
				throw Error("No active camera in scene")
			}

			const delta = this.#clock.getDelta() || 0.016;
			const elapsed = this.#clock.getElapsedTime();

			// update mouse intersection
			this.mouseIntersectionController.cast(
				camera,
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

			// scene update
			this.#scene._onUpdate(delta, elapsed);

			// scene update
			this.#renderPipeline?.onRender(this.#scene, this.#scene.getActiveCamera()!);

			// update default UI scheduler
			this.updateDefaultUiScheduler && defaultScheduler.update();

			// clear input and event queues
			this.input.clear();
			this.events.clear();

			this.#errorCount = 0;
		}
		catch(e)
		{
			ELYSIA_LOGGER.error("in update loop:", new UnhandledUpdateLoopError(e instanceof Error ? e.message : String(e)))
			this.#errorCount++;
		}
	}

	private mouseIntersectionController = new MouseIntersections;

	#errorCount = 0;
	#resizeController: ResizeController;
	#stats: boolean | ElysiaStats = false;
	#clock = new Three.Clock;
	#renderPipeline?: RenderPipeline;
	#output: HTMLCanvasElement;
	#scene?: Scene;
	#rendering = false;
}

class UnhandledUpdateLoopError extends Error
{
	constructor(message: string)
	{
		super(message)
		this.stack = this.stack?.split("\n").filter(
			(line) => !line.startsWith("FrameRequestCallback*update")).filter(
			(line) => !line.startsWith("UnhandledUpdateLoopError"))?.join("\n")
	}
}
