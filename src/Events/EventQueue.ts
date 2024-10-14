import { ElysiaEvent } from "./Event.ts";
import { Constructor } from "../Core/Utilities.ts";

/**
 * A queue of events.
 * Events are pushed to the queue and then flushed.
 * Events are flushed in the order they were pushed.
 * Events pushed after the queue has been flushed are pushed to a secondary queue
 * and are flushed only after .clear() is called.
 */
export class ElysiaEventQueue
{

	constructor()
	{
		this.flush = this.flush.bind(this);
		this.flushAndClear = this.flushAndClear.bind(this);
		this.clear = this.clear.bind(this);
		this.push = this.push.bind(this);
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		this.iterator = this.iterator.bind(this);
	}

	/**
	 * Push an event to the queue.
	 * @param event
	 */
	public push(event: ElysiaEvent<any>)
	{
		if(this.#hasFlushed)
		{
			this.nextQueue.push(event);
			return;
		}
		this.queue.push(event);
	}

	/**
	 * Iterate over the queue.
	 */
	public iterator(): IterableIterator<ElysiaEvent<any>>
	{
		return this.queue[Symbol.iterator]();
	}

	/**
	 * Flush the queue. This does NOT clear the queue.
	 */
	public flush()
	{
		this.#hasFlushed = true;
		for(const event of this.queue)
		{
			const listeners = this.listeners.get(event.constructor as Constructor<ElysiaEvent<any>>);
			if(!listeners)
			{
				continue;
			}

			for(const listener of listeners)
			{
				try
				{
					listener(event.value);
				}
				catch(e)
				{
					console.error(e);
				}
			}
		}
	}

	/**
	 * Flush and clear the queue.
	 */
	public flushAndClear()
	{
		this.flush();
		this.clear();
	}

	/**
	 * Clear the queue.
	 */
	public clear()
	{
		const temp = this.queue;
		temp.length = 0;
		this.queue = this.nextQueue;
		this.nextQueue = temp;
		this.#hasFlushed = false;
	}

	/**
	 * Subscribe to an event.
	 * @param type
	 * @param listener
	 */
	public subscribe<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void)
	{
		const listeners = this.listeners.get(type) ?? new Set();
		listeners.add(listener);
		this.listeners.set(type, listeners);

		return () => void this.unsubscribe(type, listener);
	}

	/**
	 * Unsubscribe from an event.
	 * @param type
	 * @param listener
	 */
	public unsubscribe<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void)
	{
		const listeners = this.listeners.get(type);
		if(!listeners)
		{
			return;
		}

		listeners.delete(listener);
	}

	private readonly listeners = new Map<new (value: any) => ElysiaEvent<any>, Set<(value: any) => void>>();

	private queue: ElysiaEvent<any>[] = [];

	private nextQueue: ElysiaEvent<any>[] = [];

	#hasFlushed = false;
}

