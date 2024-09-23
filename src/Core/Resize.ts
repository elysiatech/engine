import { Destroyable } from "./Lifecycle";
import { isBrowser } from "./Asserts";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ElysiaEvent } from "../Events/Event";

export class ResizeEvent extends ElysiaEvent<{ x: number, y: number }> {}

export class ResizeController implements Destroyable
{
	constructor()
	{
		if(!isBrowser()) return;
		window.addEventListener("resize", this.onResize);
	}

	onResize = (e: Event) =>
	{
		ElysiaEventDispatcher.dispatchEvent(new ResizeEvent({ x: window.innerWidth, y: window.innerHeight }));
	}

	destructor() {
		window.removeEventListener("resize", this.onResize);
	}
}