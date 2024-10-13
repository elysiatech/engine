import { ElysiaEvent } from "./Event";
import { Constructor } from "../Core/Utilities";
/**
 * Sync event dispatcher.
 */
export declare class ElysiaEventDispatcher {
    /**
     * Add an event listener.
     * @param type
     * @param listener
     */
    static addEventListener<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void): () => void;
    /**
     * Add an event listener.
     * @param type
     * @param listener
     */
    addEventListener<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void): () => void;
    /**
     * Remove an event listener.
     * @param type
     * @param listener
     */
    static removeEventListener<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void): void;
    /**
     * Remove an event listener.
     * @param type
     * @param listener
     */
    removeEventListener<T extends Constructor<ElysiaEvent<any>>>(type: T, listener: (value: InstanceType<T>['value']) => void): void;
    /**
     * Dispatch an event.
     * @param event
     */
    static dispatchEvent<T extends Constructor<ElysiaEvent<any>>>(event: InstanceType<T>): void;
    /**
     * Dispatch an event.
     * @param event
     */
    dispatchEvent<T extends Constructor<ElysiaEvent<any>>>(event: InstanceType<T>): void;
    /**
     * Clear all listeners.
     */
    static clear(): void;
    /**
     * Clear all listeners.
     */
    clear(): void;
    private static listeners;
    private listeners;
}
