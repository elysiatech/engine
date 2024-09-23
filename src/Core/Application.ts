import { LogLevel } from "../Logging/Levels";
import { isDestroyable, isDev } from "./Asserts";
import { MouseIntersections } from "../Input/MouseIntersections";
import { ElysiaEventQueue } from "../Events/EventQueue";
import { InputQueue } from "../Input/InputQueue";
import { AssetLoader } from "../../old/Assets/AssetLoader";
import { Profiler } from "./Profiler";
import { AudioPlayer } from "../Audio/AudioPlayer";
import { MouseObserver } from "../Input/Mouse";
import { Scene } from "../Scene/Scene";
import { RenderPipeline } from "../RPipeline/RenderPipeline";
import { BasicRenderPipeline } from "../RPipeline/BasicRenderPipeline";
import * as Three from "three";
import { ELYSIA_LOGGER } from "./Logger";
import { ResizeController, ResizeEvent } from "./Resize";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";

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
}

export class Application {

	public readonly events: ElysiaEventQueue;

	public readonly mouse = new MouseObserver;

	public readonly input = new InputQueue;

	public readonly profiler: Profiler;

	public readonly audio: AudioPlayer;

	public get renderPipeline() { return this.#renderPipeline!; }

	constructor(config: ApplicationConstructorArguments = {})
	{
		this.loadScene = this.loadScene.bind(this)
		this.destructor = this.destructor.bind(this)
		this.render = this.render.bind(this)

		SET_ELYSIA_LOGLEVEL(config.logLevel ?? isDev() ? LogLevel.Debug : LogLevel.Production)

		this.events = config.eventQueue ?? new ElysiaEventQueue
		this.profiler = config.profiler ?? new Profiler
		this.audio = config.audio ?? new AudioPlayer
		this.#renderPipeline = config.renderPipeline ?? new BasicRenderPipeline;
		this.#stats = config.stats ?? false;

		this.#output = config.output ?? document.createElement("canvas");

		if(!config.output)
		{
			ELYSIA_LOGGER.debug("No output element provided, creating a new one")
			document.body.appendChild(this.#output)
			this.#output.style.width = "100%";
			this.#output.style.height = "100vh";
			this.#output.style.display = "block";
			this.#output.style.margin = "0";
			this.#output.style.padding = "0";
		}

		this.#resizeController = new ResizeController();

		this.mouse.register(this.#output)
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
		this.#scene._create();
		this.#scene._start();
		ELYSIA_LOGGER.debug("Scene started", scene)
		this.#rendering = true;
		this.render();
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

	private render()
	{
		if(!this.#scene || !this.#rendering)
		{
			ELYSIA_LOGGER.error("No scene loaded, or rendering disabled")
			return;
		}

		requestAnimationFrame(this.render);

		const camera = this.#scene.getActiveCamera();

		if(!camera)
		{
			ELYSIA_LOGGER.error("No active camera found in scene");
			return;
		}

		const delta = this.#clock.getDelta();
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

		// scene update
		this.#scene._update(delta, elapsed);

		// scene render
		this.#renderPipeline?.onRender(this.#scene, this.#scene.getActiveCamera()!);

		// clear input and event queues
		this.input.clear();
		this.events.clear();
	}

	private mouseIntersectionController = new MouseIntersections;

	#resizeController: ResizeController;
	#stats = false;
	#clock = new Three.Clock;
	#renderPipeline?: RenderPipeline;
	#output: HTMLCanvasElement;
	#scene?: Scene;
	#rendering = false;
}