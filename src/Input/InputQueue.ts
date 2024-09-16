import { KeyCode } from "./KeyCode";
import { ObjectPool } from "../Containers/ObjectPool";
import { QueuedEvent } from "./QueuedEvent";

export class InputQueue {

	constructor() {
		for(const value in KeyCode) {
			if (isNaN(Number(value))) {
				return;
			}
			// @ts-ignore
			this.queue.set(value, new Set)
		}
	}

	public onKey(key: KeyCode, callback: Function) {}

	public onKeyDown(key: KeyCode, callback: Function) {}

	public onKeyUp(key: KeyCode, callback: Function) {}

	public isDown(key: KeyCode) {
		return this.currentlyPressed.has(key);
	}

	public flush() {}

	public clear() { this.queue.clear(); }

	private pool = new ObjectPool<QueuedEvent>(() => new QueuedEvent, 30)

	private callbacks = new Map<KeyCode, Set<(key: QueuedEvent) => void>>

	private queue = new Map<KeyCode, Set<QueuedEvent>>()

	private currentlyPressed = new Set<KeyCode>();
}
