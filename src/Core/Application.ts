import { LogLevel } from "../Logging/Levels";
import { isDev } from "./Asserts";
import { MouseIntersections } from "../Input/MouseIntersections";
import { ElysiaEventQueue } from "../Events/EventQueue";
import { InputQueue } from "../Input/InputQueue";
import { AssetLoader } from "../../old/Assets/AssetLoader";

export class Application {

	public readonly events: ElysiaEventQueue;

	public readonly mouse = {
		x: 0,
		y: 0,
		intersections: () => this.mouseIntersectionController.intersections
	}

	public readonly input = new InputQueue;

	constructor(config: { logLevel?: LogLevel, eventQueue?: ElysiaEventQueue, assets: AssetLoader<any> }) {
		SET_ELYSIA_LOGLEVEL(config.logLevel ?? isDev() ? LogLevel.Debug : LogLevel.Production)

		this.events = config.eventQueue ?? new ElysiaEventQueue

		this.onMouseMove = this.onMouseMove.bind(this)
		window.addEventListener("mousemove", this.onMouseMove);
	}

	public destructor() {
		window.removeEventListener("mousemove", this.onMouseMove)
	}

	private onMouseMove(event: MouseEvent) {
		this.mouse.x = event.clientX
		this.mouse.y = event.clientY
	}

	private mouseIntersectionController = new MouseIntersections;
}