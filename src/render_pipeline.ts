import type * as Three from "three";
import type { Application } from "./application";
import type { Scene } from "./scene";

export abstract class RenderPipeline {
	
	abstract getGl(): Three.WebGLRenderer;

	abstract render(frametime: number, elapsed: number): void;

	onLoadScene?(app: Application, scene: Scene): void;

	onUnloadScene?(app: Application, scene: Scene): void;

	onResize?(bounds: DOMRect): void;
}
