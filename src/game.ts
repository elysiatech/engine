import * as Three from "three";
import { ASSERT } from "./asserts";
import { SoundManager } from "./audio";
import { InputQueue } from "./input";
import type { RenderPipeline } from "./render_pipeline";
import type { Scene } from "./scene";

export class Game {
	public currentScene: Scene | null = null;

	public currentSceneLoaded = false;

	public sound = new SoundManager();

	public input = new InputQueue();

	public clock = new Three.Clock();

	public pointer = new Three.Vector2();

	public renderPipeline: RenderPipeline;

	constructor(args: { renderPipeline: RenderPipeline }) {
		this.loadScene = this.loadScene.bind(this);
		this.play = this.play.bind(this);
		this.gameloop = this.gameloop.bind(this);
		this.resize = this.resize.bind(this);
		this.onPointerMove = this.onPointerMove.bind(this);

		this.renderPipeline = args.renderPipeline;
	}

	public async loadScene(scene: Scene) {
		ASSERT(scene, "Scene must be defined");

		if (this.currentScene) {
			this.currentScene.destructor?.();
		}

		scene.game = this;

		this.currentScene = scene;

		await scene.setup?.();

		this.renderPipeline.onLoadScene?.(this, scene);

		this.renderPipeline
			.getRenderer()
			.domElement.addEventListener("mousemove", this.onPointerMove.bind(this));

		window.addEventListener("resize", this.resize.bind(this));

		this.resize();

		this.currentSceneLoaded = true;
	}

	public play() {
		ASSERT(this.currentSceneLoaded, "Scene must be loaded before playing");
		ASSERT(this.currentScene);

		this.clock.elapsedTime = 0;

		this.currentScene.play();

		requestAnimationFrame(this.gameloop.bind(this));
	}

	private gameloop() {
		requestAnimationFrame(this.gameloop.bind(this));
		this.currentScene!.update(
			this.clock.getDelta(),
			this.clock.getElapsedTime(),
		);
	}

	private resize() {
		const bounds = this.renderPipeline
			.getRenderer()
			.domElement.getBoundingClientRect();
		this.renderPipeline.onResize?.(bounds);
		this.currentScene?.root.resize(bounds);
	}

	private onPointerMove(event: MouseEvent) {
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}
}
