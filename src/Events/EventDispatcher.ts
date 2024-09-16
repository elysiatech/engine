import { ElysiaEvent } from "./Event";
import { Constructor } from "../Core/Utilities";



/**
 * Sync event dispatcher.
 */
export class ElysiaEventDispatcher
{

	/**
	 * Add an event listener.
	 * @param type
	 * @param listener
	 */
	static addEventListener<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void)
	{
		const listeners = this.listeners.get(type) ?? new Set();
		listeners.add(listener);
		this.listeners.set(type, listeners);

		return () => this.removeEventListener(type, listener);
	}

	/**
	 * Remove an event listener.
	 * @param type
	 * @param listener
	 */
	static removeEventListener<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void)
	{
		const listeners = this.listeners.get(type);
		if(!listeners)
		{
			return;
		}

		listeners.delete(listener);
	}

	/**
	 * Dispatch an event.
	 * @param event
	 */
	static dispatchEvent<T extends Constructor<ElysiaEvent<any>>>(event: InstanceType<T>)
	{
		const listeners = this.listeners.get(event.constructor as T);

		if(!listeners)
		{
			return;
		}

		for(const listener of listeners)
		{
			try
			{
				listener(event.value);
			}
			catch (e)
			{
				console.error(e);
			}
		}
	}

	private static listeners = new Map<Constructor<ElysiaEvent<any>>, Set<Function>>;
}