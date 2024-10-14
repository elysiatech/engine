var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Queue_items;
/**
 * A simple queue implementation. FIFO.
 */
export class Queue {
    constructor() {
        _Queue_items.set(this, []);
    }
    /**
     * Return the number of items in the queue.
     */
    get size() { return __classPrivateFieldGet(this, _Queue_items, "f").length; }
    /**
     * Add an item to the queue.
     * @param item
     */
    enqueue(item) { __classPrivateFieldGet(this, _Queue_items, "f").push(item); }
    /**
     * Remove and return the first item in the queue.
     */
    dequeue() { return __classPrivateFieldGet(this, _Queue_items, "f").shift(); }
    /**
     * Return the first item in the queue without removing it.
     */
    peek() { return __classPrivateFieldGet(this, _Queue_items, "f")[0]; }
    /**
     * Check if the queue is empty.
     */
    isEmpty() { return __classPrivateFieldGet(this, _Queue_items, "f").length === 0; }
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
        return __classPrivateFieldGet(this, _Queue_items, "f")[Symbol.iterator]();
    }
}
_Queue_items = new WeakMap();
