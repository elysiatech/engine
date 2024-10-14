/**
 * A bidirectional communication channel between a worker and the main thread.
 * Public methods starting with "on" will be called when a message is received, with
 * the payload as the first argument.
 */
export declare class WorkerThread {
    private worker?;
    /**
     * Create a new worker thread.
     * @param worker - The worker for the main thread to listen to. Leave undefined if running in worker.
     */
    constructor(worker?: Worker | undefined);
    /**
     * Listen for messages from the worker or main thread.
     */
    listen(): this;
    /**
     * Send a message to the worker or main thread.
     * @param key - The message key.
     * @param payload - The data to send.
     * @example
     * ```ts
     * workerThread.send("onHello", "world");
     * ```
     */
    send(key: string, payload: any): void;
    private onMessage;
}
