import { KeyCode } from "./KeyCode.ts";
import { QueuedEvent } from "./QueuedEvent.ts";
import { Destroyable } from "../Core/Lifecycle.ts";
import { MouseObserver } from "./Mouse.ts";
import { MouseCode } from "./MouseCode.ts";
interface InputQueueConstructorArguments {
    mouseTarget?: HTMLElement;
}
/**
 * Input queue backed by an object pool for event recycling.
 */
export declare class InputQueue implements Destroyable {
    readonly mouse: MouseObserver;
    constructor(args?: InputQueueConstructorArguments);
    /**
     * Add a callback to be called when the specified key or button is pressed.
     * The QueuedEvent object passed to the callback is part of an object pool and will be freed after the callback returns.
     * If you need to keep the QueuedEvent object, you must clone it using the clone() method.
     * @param key The key or button to listen for.
     * @param callback The callback to call when the key is pressed.
     * @returns A function that can be called to remove the callback.
     **/
    onKeyDown(key: KeyCode | MouseCode, callback: (key: QueuedEvent) => void): void;
    /**
     * Add a callback to be called when the specified key or button is released.
     * The QueuedEvent object passed to the callback is part of an object pool and will be freed after the callback returns.
     * If you need to keep the QueuedEvent object, you must clone it using the clone() method.
     * @param key The key or button to listen for.
     * @param callback The callback to call when the key is released.
     * @returns A function that can be called to remove the callback.
     **/
    onKeyUp(key: KeyCode | MouseCode, callback: (key: QueuedEvent) => void): void;
    /** Add a callback to be called when the specified key is pressed or released. */
    onMouseMove(callback: (event: MouseEvent) => void): () => void;
    /** Check if a key or mouse button is down. */
    isDown(key: KeyCode | MouseCode): boolean;
    /** Flush all events in the queue to their respective listeners, without clearing the queue. */
    flush(): void;
    /** clear all events in the queue and free them from the pool. */
    clear(): void;
    destructor(): void;
    private pool;
    private keyDownCallbacks;
    private keyUpCallbacks;
    private queue;
    private currentlyPressed;
    private keyDownHandler;
    private keyUpHandler;
    private mouseDownHandler;
    private mouseUpHandler;
}
export {};
