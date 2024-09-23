import { Destroyable } from "../Core/Lifecycle";

export class MouseObserver implements Destroyable {

	public get x() { return this.#x; }

	public get y() { return this.#y; }

	register(target: HTMLElement) {
		target.addEventListener("mousemove", this.#onMouseMove);
	}

	destructor() {
		window.removeEventListener("mousemove", this.#onMouseMove);
	}

	#x = 0;
	#y = 0;

	#onMouseMove = (event: MouseEvent) => {
		this.#x = event.clientX;
		this.#y = event.clientY;
	}
}