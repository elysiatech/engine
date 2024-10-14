/**
 * Sync event dispatcher.
 */
export class ElysiaEventDispatcher {
    /**
     * Add an event listener.
     * @param type
     * @param listener
     */
    static addEventListener(type, listener) {
        const listeners = this.listeners.get(type) ?? new Set();
        listeners.add(listener);
        this.listeners.set(type, listeners);
        return () => this.removeEventListener(type, listener);
    }
    /**
     * Add an event listener.
     * @param type
     * @param listener
     */
    addEventListener(type, listener) {
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
    static removeEventListener(type, listener) {
        const listeners = this.listeners.get(type);
        if (!listeners) {
            return;
        }
        listeners.delete(listener);
    }
    /**
     * Remove an event listener.
     * @param type
     * @param listener
     */
    removeEventListener(type, listener) {
        const listeners = this.listeners.get(type);
        if (!listeners) {
            return;
        }
        listeners.delete(listener);
    }
    /**
     * Dispatch an event.
     * @param event
     */
    static dispatchEvent(event) {
        const listeners = this.listeners.get(event.constructor);
        if (!listeners) {
            return;
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
    /**
     * Dispatch an event.
     * @param event
     */
    dispatchEvent(event) {
        const listeners = this.listeners.get(event.constructor);
        if (!listeners) {
            return;
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
    /**
     * Clear all listeners.
     */
    static clear() { this.listeners.clear(); }
    /**
     * Clear all listeners.
     */
    clear() { this.listeners.clear(); }
    static listeners = new Map;
    listeners = new Map;
}
