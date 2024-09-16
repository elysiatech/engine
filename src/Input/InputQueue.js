import { KeyCode } from "./KeyCode";
import { ObjectPool } from "../Containers/ObjectPool";
export class InputQueue {
    constructor() {
        for (const value in KeyCode) {
            if (isNaN(Number(value))) {
                return;
            }
            // @ts-ignore
            this.queue.set(value, new Set);
        }
    }
    onKey(key, callback) { }
    onKeyDown(key, callback) { }
    onKeyUp(key, callback) { }
    isDown(key) {
        return this.currentlyPressed.has(key);
    }
    flush() {
    }
    clear() { this.queue.clear(); }
    pool = new ObjectPool(() => ({ key: KeyCode.Key_1, timestamp: 0 }), 30);
    callbacks = new Map;
    queue = new Map();
    currentlyPressed = new Set();
}
