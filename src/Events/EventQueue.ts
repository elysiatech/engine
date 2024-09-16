import { ElysiaEvent } from "./Event";
import { Constructor } from "../Core/Utilities";

export class ElysiaEventQueue {

	/**
	 * Push an event to the queue.
	 * @param event
	 */
	public push(event: ElysiaEvent<any>)
	{
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
		this.queue.length = 0;
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

	private readonly queue: ElysiaEvent<any>[] = [];
}