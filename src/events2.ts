type EventConstructor<T> = new () => Event<T>

type Instance<T extends EventConstructor<any>> = T extends EventConstructor<infer U> ? U : never;

type EventInput<T> = EventConstructor<T> | string | symbol;

export enum EventQueueMode {
	Immediate = 0,
	Queued = 1,
}

export class Event<T> {
	type?: string | symbol;

	data: T

	timeStamp: number;

	constructor(data: T) {
		this.timeStamp = Date.now();
		this.data = data;
	}
}

type Callback<T = unknown> = (data: T, queue: EventQueue) => void;

type Unlisten = () => void;

export class EventQueue {

	public mode: EventQueueMode = EventQueueMode.Immediate;

	readonly queue: Array<Event<unknown>> = [];

	public emit<T extends EventInput<any>>(
		type: T, data: T extends EventConstructor<any> ? Instance<T>["data"] : unknown
	): void {
		if (this.mode === EventQueueMode.Queued) {
			if(typeof type === "function"){
				this.queue.push(new type(data));
			} else {
				const e = new Event(data)
				e.type = type;
				this.queue.push(e);
			}
		} else {
			this.emitSync(type, data);
		}
	}

	public emitSync<T extends EventInput<any>>(
		type: T, data: T extends EventConstructor<any> ? Instance<T>["data"] : unknown
	): void {
		this.subscribers.get(type)?.forEach((handler) => handler(data, this));
	}

	public subscribe<T extends Event<unknown>>(
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

	public once<T extends Event<unknown>>(
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

	*[Symbol.iterator](): Generator<Event<unknown>> {
		while (this.queue.length) {
			yield this.queue.shift()!;
		}
	}

	private subscribers = new Map<string | symbol | EventConstructor, Set<Callback>>();
}

const eq = new EventQueue; 
