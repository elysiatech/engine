import { CSSResult, TemplateResult, css } from "lit";
import type { Actor } from "./actor";
import type { Scene } from "./scene";
import { ElysiaElement, defineComponent } from "./ui";

export class Behavior {

	public static GUIStylesheet?: CSSResult

	get isBehavior() {
		return true;
	}

	public id?: string | symbol;

	public tags = new Set<string | symbol>();

	parent: Actor | null = null;

	scene: Scene | null = null;

	initialized = false;

	spawned = false;

	destroyed = false;

	create() {
		if (this.initialized || this.destroyed || !this.scene || !this.scene.game) return;
		this.onCreate();

		if(this.gui){
			const renderFn = this.gui.bind(this);

			const guiStylesheet = this.constructor.GUIStylesheet ?? css``

			const scheduler = this.scene.game.UiScheduler;

			const ui = class extends ElysiaElement {
				static Tag = "actor-id" + Math.random().toString(36).substring(7);

				static styles = guiStylesheet;

				scheduler = scheduler;

				render(){
					return renderFn()
				}
			}
			defineComponent(ui)
			this.uiElement = document.createElement(ui.Tag);
		}

		this.initialized = true;
	}

	spawn() {
		if (!this.initialized || this.spawned || this.destroyed) return;
		this.onSpawn();
		this.spawned = true;
		this.uiElement && this.scene?.game?.renderPipeline.getRenderer()
			.domElement.parentNode!.appendChild(this.uiElement)
	}

	update(frametime: number, elapsed: number) {
		if (!this.initialized || !this.spawned || this.destroyed) return;
		this.onUpdate(frametime, elapsed);
	}

	despawn() {
		if (!this.spawned || this.destroyed) return;
		this.onDespawn();
		this.uiElement && this.scene?.game?.renderPipeline.getRenderer()
			.domElement.removeChild(this.uiElement)
	}

	destroy() {
		if (this.destroyed) return;
		this.destructor();
	}

	resize(bounds: DOMRect) {
		if (!this.initialized || this.destroyed) return;
		this.onResize(bounds);
	}

	dispose(...callbacks: (() => void)[]) {
		this.disposables.push(...callbacks);
	}

	onCreate(): void {}
	onSpawn(): void {}
	onUpdate(frametime: number, elapsedtime: number): void {}
	onDespawn(): void {}
	onResize(bounds: DOMRect): void {}
	gui?(): TemplateResult;
	destructor(): void {
		this.disposables.forEach((fn) => fn());
		this.disposables = [];
		this.destroyed = true;
	}

	private disposables: (() => void)[] = [];

	private uiElement?: HTMLElement;
}
