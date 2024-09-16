export enum EventQueueMode {
	Immediate = 0,
	Queued = 1,
}

export interface Event<T = unknown> {
	type: string | symbol;
	data: T;
}

export interface QueuedEvent<T = unknown> extends Event<T> {
	timestamp: number;
}

type Callback<T = unknown> = (data: T, queue: EventQueue) => void;

type Unlisten = () => void;

export class EventQueue {
	public mode: EventQueueMode = EventQueueMode.Immediate;

	readonly queue: Array<QueuedEvent> = [];

	public emit<T extends Event>(type: T | T["type"], data: T["data"]): void {
		const t = typeof type === "string" || typeof type === "symbol" ? type : type.type;
		if (this.mode === EventQueueMode.Queued) {
			this.queue.push({ type: t, data, timestamp: Date.now() });
		} else {
			this.emitSync(t, data);
		}
	}

	public emitSync<T extends Event>(type: T | T["type"], data: T["data"]): void {
		const t = typeof type === "string" || typeof type === "symbol" ? type : type.type;
		this.subscribers.get(t)?.forEach((handler) => handler(data, this));
	}

	public subscribe<T extends Event>(
		type: T | T["type"],
		handler: Callback<T["data"]>,
	): Unlisten {
		const t = typeof type === "string" || typeof type === "symbol" ? type : type.type;
		if (!this.subscribers.has(t)) {
			this.subscribers.set(t, new Set());
		}
		this.subscribers.get(t)!.add(handler);
		return () => void this.subscribers.get(t)?.delete(handler);
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

const eq = new EventQueue; 
