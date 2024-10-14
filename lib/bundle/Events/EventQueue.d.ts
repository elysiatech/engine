import { ElysiaEvent } from "./Event.ts";
import { Constructor } from "../Core/Utilities.ts";
/**
 * A queue of events.
 * Events are pushed to the queue and then flushed.
 * Events are flushed in the order they were pushed.
 * Events pushed after the queue has been flushed are pushed to a secondary queue
 * and are flushed only after .clear() is called.
 */
export declare class ElysiaEventQueue {
    #private;
    constructor();
    /**
     * Push an event to the queue.
     * @param event
     */
    push(event: ElysiaEvent<any>): void;
    /**
     * Iterate over the queue.
     */
    iterator(): IterableIterator<ElysiaEvent<any>>;
    /**
     * Flush the queue. This does NOT clear the queue.
     */
    flush(): void;
    /**
     * Flush and clear the queue.
     */
    flushAndClear(): void;
    /**
     * Clear the queue.
     */
    clear(): void;
    /**
     * Subscribe to an event.
     * @param type
     * @param listener
     */
    subscribe<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void): () => undefined;
    /**
     * Unsubscribe from an event.
     * @param type
     * @param listener
     */
    unsubscribe<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void): void;
    private readonly listeners;
    private queue;
    private nextQueue;
}
