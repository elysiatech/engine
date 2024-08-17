import type * as Three from "three";
import type { Game } from "./game";
import type { Scene } from "./scene";

export abstract class RenderPipeline {
	abstract getRenderer(): Three.WebGLRenderer;

	abstract render(frametime: number, elapsed: number): void;

	onLoadScene?(game: Game, scene: Scene): void;

	onUnloadScene?(game: Game, scene: Scene): void;

	onResize?(bounds: DOMRect): void;
}
