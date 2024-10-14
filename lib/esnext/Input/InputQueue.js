import { KeyCode } from "./KeyCode.js";
import { ObjectPool } from "../Containers/ObjectPool.js";
import { QueuedEvent } from "./QueuedEvent.js";
import { MouseObserver } from "./Mouse.js";
/**
 * Input queue backed by an object pool for event recycling.
 */
export class InputQueue {
    mouse;
    constructor(args = {}) {
        this.mouse = new MouseObserver(args.mouseTarget ?? window.document.body);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
        this.mouse.addEventListener("mousedown", this.mouseDownHandler);
        this.mouse.addEventListener("mouseup", this.mouseUpHandler);
    }
    /**
     * Add a callback to be called when the specified key or button is pressed.
     * The QueuedEvent object passed to the callback is part of an object pool and will be freed after the callback returns.
     * If you need to keep the QueuedEvent object, you must clone it using the clone() method.
     * @param key The key or button to listen for.
     * @param callback The callback to call when the key is pressed.
     * @returns A function that can be called to remove the callback.
     **/
    onKeyDown(key, callback) {
        if (!this.keyDownCallbacks.has(key)) {
            this.keyDownCallbacks.set(key, new Set);
        }
        this.keyDownCallbacks.get(key).add(callback);
    }
    /**
     * Add a callback to be called when the specified key or button is released.
     * The QueuedEvent object passed to the callback is part of an object pool and will be freed after the callback returns.
     * If you need to keep the QueuedEvent object, you must clone it using the clone() method.
     * @param key The key or button to listen for.
     * @param callback The callback to call when the key is released.
     * @returns A function that can be called to remove the callback.
     **/
    onKeyUp(key, callback) {
        if (!this.keyUpCallbacks.has(key)) {
            this.keyUpCallbacks.set(key, new Set);
        }
        this.keyUpCallbacks.get(key).add(callback);
    }
    /** Add a callback to be called when the specified key is pressed or released. */
    onMouseMove(callback) { return this.mouse.addEventListener("mousemove", callback); }
    /** Check if a key or mouse button is down. */
    isDown(key) { return this.currentlyPressed.has(key); }
    /** Flush all events in the queue to their respective listeners, without clearing the queue. */
    flush() {
        for (const [key, set] of this.queue) {
            for (const event of set) {
                if (event.type === "down" && this.keyDownCallbacks.has(key)) {
                    for (const callback of this.keyDownCallbacks.get(key)) {
                        callback(event);
                    }
                }
                else if (event.type === "up" && this.keyUpCallbacks.has(key)) {
                    for (const callback of this.keyUpCallbacks.get(key)) {
                        callback(event);
                    }
                }
            }
        }
    }
    /** clear all events in the queue and free them from the pool. */
    clear() {
        for (const set of this.queue.values()) {
            for (const event of set) {
                this.pool.free(event);
            }
            set.clear();
        }
    }
    destructor() {
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("keyup", this.keyUpHandler);
        this.mouse.removeEventListener("mousedown", this.mouseDownHandler);
        this.mouse.removeEventListener("mouseup", this.mouseUpHandler);
        this.mouse.destructor();
        this.clear();
        this.keyDownCallbacks.clear();
        this.keyUpCallbacks.clear();
    }
    pool = new ObjectPool(() => new QueuedEvent, 50);
    keyDownCallbacks = new Map;
    keyUpCallbacks = new Map;
    queue = new Map();
    currentlyPressed = new Set();
    keyDownHandler(event) {
        const key = event.code;
        if (!this.currentlyPressed.has(key)) {
            this.currentlyPressed.add(key);
            const queued = this.pool.alloc();
            queued.key = key;
            queued.type = "down";
            queued.timestamp = performance.now();
            queued.ctrlDown = event.ctrlKey;
            queued.shiftDown = event.shiftKey;
            queued.spaceDown = this.isDown(KeyCode.Space);
            queued.altDown = event.altKey;
            queued.metaDown = event.metaKey;
            queued.mouseLeftDown = this.mouse.leftDown;
            queued.mouseMidDown = this.mouse.middleDown;
            queued.mouseRightDown = this.mouse.rightDown;
            queued.mouseX = this.mouse.x;
            queued.mouseY = this.mouse.y;
            if (!this.queue.has(key)) {
                this.queue.set(key, new Set);
            }
            this.queue.get(key).add(queued);
        }
    }
    keyUpHandler(event) {
        const key = event.code;
        if (this.currentlyPressed.has(key)) {
            this.currentlyPressed.delete(key);
            const queued = this.pool.alloc();
            queued.key = key;
            queued.type = "up";
            queued.timestamp = performance.now();
            queued.ctrlDown = event.ctrlKey;
            queued.shiftDown = event.shiftKey;
            queued.spaceDown = this.isDown(KeyCode.Space);
            queued.altDown = event.altKey;
            queued.metaDown = event.metaKey;
            queued.mouseLeftDown = this.mouse.leftDown;
            queued.mouseMidDown = this.mouse.middleDown;
            queued.mouseRightDown = this.mouse.rightDown;
            queued.mouseX = this.mouse.x;
            queued.mouseY = this.mouse.y;
            if (!this.queue.has(key)) {
                this.queue.set(key, new Set);
            }
            this.queue.get(key).add(queued);
        }
    }
    mouseDownHandler(event) {
        const button = event.button;
        if (!this.currentlyPressed.has(button)) {
            this.currentlyPressed.add(button);
            const queued = this.pool.alloc();
            queued.key = button;
            queued.type = "down";
            queued.timestamp = performance.now();
            queued.ctrlDown = event.ctrlKey;
            queued.shiftDown = event.shiftKey;
            queued.spaceDown = this.isDown(KeyCode.Space);
            queued.altDown = event.altKey;
            queued.metaDown = event.metaKey;
            queued.mouseLeftDown = this.mouse.leftDown;
            queued.mouseMidDown = this.mouse.middleDown;
            queued.mouseRightDown = this.mouse.rightDown;
            queued.mouseX = this.mouse.x;
            queued.mouseY = this.mouse.y;
            if (!this.queue.has(button)) {
                this.queue.set(button, new Set);
            }
            this.queue.get(button).add(queued);
        }
    }
    mouseUpHandler(event) {
        const button = event.button;
        if (this.currentlyPressed.has(button)) {
            this.currentlyPressed.delete(button);
            const queued = this.pool.alloc();
            queued.key = button;
            queued.type = "up";
            queued.timestamp = performance.now();
            queued.ctrlDown = event.ctrlKey;
            queued.shiftDown = event.shiftKey;
            queued.spaceDown = this.isDown(KeyCode.Space);
            queued.altDown = event.altKey;
            queued.metaDown = event.metaKey;
            queued.mouseLeftDown = this.mouse.leftDown;
            queued.mouseMidDown = this.mouse.middleDown;
            queued.mouseRightDown = this.mouse.rightDown;
            queued.mouseX = this.mouse.x;
            queued.mouseY = this.mouse.y;
            if (!this.queue.has(button)) {
                this.queue.set(button, new Set);
            }
            this.queue.get(button).add(queued);
        }
    }
}
