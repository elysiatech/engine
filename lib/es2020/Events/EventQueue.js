var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ElysiaEventQueue_hasFlushed;
/**
 * A queue of events.
 * Events are pushed to the queue and then flushed.
 * Events are flushed in the order they were pushed.
 * Events pushed after the queue has been flushed are pushed to a secondary queue
 * and are flushed only after .clear() is called.
 */
export class ElysiaEventQueue {
    constructor() {
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "nextQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        _ElysiaEventQueue_hasFlushed.set(this, false);
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
    push(event) {
        if (__classPrivateFieldGet(this, _ElysiaEventQueue_hasFlushed, "f")) {
            this.nextQueue.push(event);
            return;
        }
        this.queue.push(event);
    }
    /**
     * Iterate over the queue.
     */
    iterator() {
        return this.queue[Symbol.iterator]();
    }
    /**
     * Flush the queue. This does NOT clear the queue.
     */
    flush() {
        __classPrivateFieldSet(this, _ElysiaEventQueue_hasFlushed, true, "f");
        for (const event of this.queue) {
            const listeners = this.listeners.get(event.constructor);
            if (!listeners) {
                continue;
            }
            for (const listener of listeners) {
                try {
                    listener(event.value);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
    }
    /**
     * Flush and clear the queue.
     */
    flushAndClear() {
        this.flush();
        this.clear();
    }
    /**
     * Clear the queue.
     */
    clear() {
        const temp = this.queue;
        temp.length = 0;
        this.queue = this.nextQueue;
        this.nextQueue = temp;
        __classPrivateFieldSet(this, _ElysiaEventQueue_hasFlushed, false, "f");
    }
    /**
     * Subscribe to an event.
     * @param type
     * @param listener
     */
    subscribe(type, listener) {
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
    unsubscribe(type, listener) {
        const listeners = this.listeners.get(type);
        if (!listeners) {
            return;
        }
        listeners.delete(listener);
    }
}
_ElysiaEventQueue_hasFlushed = new WeakMap();
