/**
 * A simple queue implementation. FIFO.
 */
export class Queue {
    /**
     * Return the number of items in the queue.
     */
    get size() { return this.#items.length; }
    /**
     * Add an item to the queue.
     * @param item
     */
    enqueue(item) { this.#items.push(item); }
    /**
     * Remove and return the first item in the queue.
     */
    dequeue() { return this.#items.shift(); }
    /**
     * Return the first item in the queue without removing it.
     */
    peek() { return this.#items[0]; }
    /**
     * Check if the queue is empty.
     */
    isEmpty() { return this.#items.length === 0; }
    /**
     * Remove all items from the queue, calling the provided callback for each item.
     */
    flush(callback) {
        while (!this.isEmpty()) {
            const item = this.dequeue();
            if (item)
                callback(item);
        }
    }
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
    *iterator() {
        while (!this.isEmpty()) {
            const item = this.dequeue();
            if (item)
                yield item;
            if (this.isEmpty())
                break;
        }
    }
    /**
     * Iterate over all items in the queue without removing them.
     */
    *peakIterate() {
        return this.#items[Symbol.iterator]();
    }
    #items = [];
}
