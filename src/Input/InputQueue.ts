import { KeyCode } from "./KeyCode";
import { ObjectPool } from "../Containers/ObjectPool";
import { QueuedEvent } from "./QueuedEvent";

export class InputQueue {

	constructor(mouse?: { x: number, y: number }) {
		for(const value in KeyCode) {
			if (isNaN(Number(value))) {
				return;
			}
			// @ts-ignore
			this.queue.set(value, new Set)
		}

		window.addEventListener("keydown", (e) => {
			const key = e.key;
			this.currentlyPressed.add(key);
			// add to queue
			const event = this.pool.alloc()
			event.key = key;
			event.type = "down";
			this.queue.get(key)!.add(event);
		})

		window.addEventListener("keyup", (e) => {
			// handle keyup
			const key = e.key;
			this.currentlyPressed.delete(key);
		})

		if(!mouse){
			window.addEventListener("mousemove", (e) => {
				this.mouse.x = e.clientX;
				this.mouse.y = e.clientY;
			})
		} else {
			this.mouse = mouse;
		}
	}

	public onKey(key: KeyCode, callback: Function) {}

	public onKeyDown(key: KeyCode, callback: Function) {}

	public onKeyUp(key: KeyCode, callback: Function) {}

	public isDown(key: KeyCode) {
		return this.currentlyPressed.has(key);
	}

	public flush() {}

	public clear() {
		for(const set of this.queue.values()) {
			for(const event of set) {
				this.pool.free(event);
			}
			set.clear()
		}
	}

	private pool = new ObjectPool<QueuedEvent>(() => new QueuedEvent, 30)

	private callbacks = new Map<KeyCode, Set<(key: QueuedEvent) => void>>

	private queue = new Map<KeyCode, Set<QueuedEvent>>()

	private currentlyPressed = new Set<KeyCode>();

	public readonly mouse = {
		x: 0,
		y: 0,
	}
}
