enum EventQueueMode {
	Immediate = 0,
	Queued = 1,
}

interface Event<T = unknown> {
	type: string | symbol;
	data: T;
}

interface QueuedEvent<T = unknown> extends Event<T> {
	timestamp: number;
}

type Callback<T = unknown> = (data: T, queue: EventQueue) => void;

type Unlisten = () => void;

export class EventQueue {
	public mode: EventQueueMode = EventQueueMode.Immediate;

	readonly queue: Array<QueuedEvent> = [];

	public emit<T extends Event>(type: T["type"], data: T["data"]): void {
		if (this.mode === EventQueueMode.Queued) {
			this.queue.push({ type, data, timestamp: Date.now() });
		} else {
			this.emitSync(type, data);
		}
	}

	public emitSync<T extends Event>(type: T["type"], data: T["data"]): void {
		this.subscribers.get(type)?.forEach((handler) => handler(data, this));
	}

	public subscribe<T extends Event>(
		type: T["type"],
		handler: Callback<T["data"]>,
	): Unlisten {
		if (!this.subscribers.has(type)) {
			this.subscribers.set(type, new Set());
		}
		this.subscribers.get(type)!.add(handler);
		return () => void this.subscribers.get(type)?.delete(handler);
	}

	public once<T extends Event>(
		type: T["type"],
		handler: Callback<T["data"]>,
	): Unlisten {
		const unlisten = this.subscribe(type, (data, queue) => {
			unlisten();
			handler(data, queue);
		});
		return unlisten;
	}

	public flush(): void {
		for (const event of this) {
			for (const sub of this.subscribers.get(event.type) ?? []) {
				sub(event.data, this);
			}
		}
	}

	*[Symbol.iterator](): Generator<Event> {
		while (this.queue.length) {
			yield this.queue.shift()!;
		}
	}

	private subscribers = new Map<string | symbol, Set<Callback>>();
}
