/**
 * A simple queue implementation. FIFO.
 */
export declare class Queue<T> {
    #private;
    /**
     * Return the number of items in the queue.
     */
    get size(): number;
    /**
     * Add an item to the queue.
     * @param item
     */
    enqueue(item: T): void;
    /**
     * Remove and return the first item in the queue.
     */
    dequeue(): T | undefined;
    /**
     * Return the first item in the queue without removing it.
     */
    peek(): T;
    /**
     * Check if the queue is empty.
     */
    isEmpty(): boolean;
    /**
     * Remove all items from the queue, calling the provided callback for each item.
     */
    flush(callback: (item: T) => void): void;
    /**
     * Iterate over all items in the queue, removing them as they are yielded
     * @example
     * for(const item of queue.iterator())
     * {
     *    console.log(item);
     *    // Do something with item
     *    // Item is removed from the queue after the loop
     * }
     */
    iterator(): Generator<NonNullable<T>, void, unknown>;
    /**
     * Iterate over all items in the queue without removing them.
     */
    peakIterate(): Generator<never, ArrayIterator<T>, unknown>;
}
