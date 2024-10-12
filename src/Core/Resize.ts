import { Destroyable } from "./Lifecycle";
import { isBrowser } from "./Asserts";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ElysiaEvent } from "../Events/Event";

export class ResizeEvent extends ElysiaEvent<{ x: number, y: number }> {}

export class ResizeController implements Destroyable
{
	width = 0;
	height = 0;

	constructor(element?: HTMLElement) {
		if(!isBrowser()) return;

		if(element)
		{
			this.#observer = new ResizeObserver((entries) => {
				const cr = entries[0].contentRect;
				this.width = cr.width;
				this.height = cr.height;
				this.#event.dispatchEvent(new ResizeEvent({ x: this.width, y: this.height }));
			})
			const bounds = element.getBoundingClientRect();
			this.width = bounds.width;
			this.height = bounds.height;
		}
		else
		{
			window.addEventListener("resize", this.#onResize);
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		}

		this.addEventListener = this.#event.addEventListener.bind(this.#event);
		this.removeEventListener = this.#event.removeEventListener.bind(this.#event);
	}

	addEventListener!: ElysiaEventDispatcher["addEventListener"];

	removeEventListener!: ElysiaEventDispatcher["removeEventListener"];

	destructor() {
		window.removeEventListener("resize", this.#onResize);
		this.#observer?.disconnect();
		this.#event.clear();
	}

	#event = new ElysiaEventDispatcher;

	#observer?: ResizeObserver;

	#onResize = (e: Event) =>
	{
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.#event.dispatchEvent(new ResizeEvent({ x: this.width, y: this.height }));
	}
}