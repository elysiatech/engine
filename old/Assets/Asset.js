import { ResolvablePromise } from "../Utils/ResolvablePromise";
export var State;
(function (State) {
    State[State["Idle"] = 0] = "Idle";
    State[State["Loading"] = 1] = "Loading";
    State[State["Complete"] = 2] = "Complete";
    State[State["Errored"] = 3] = "Errored";
})(State || (State = {}));
export var StatusUpdateEvent;
(function (StatusUpdateEvent) {
    StatusUpdateEvent[StatusUpdateEvent["Loading"] = 0] = "Loading";
    StatusUpdateEvent[StatusUpdateEvent["Loaded"] = 1] = "Loaded";
    StatusUpdateEvent[StatusUpdateEvent["Error"] = 2] = "Error";
    StatusUpdateEvent[StatusUpdateEvent["Progress"] = 3] = "Progress";
})(StatusUpdateEvent || (StatusUpdateEvent = {}));
export class Asset {
    #data;
    #progress = 0;
    #error;
    #loading = false;
    #complete = false;
    #promise = new ResolvablePromise();
    #subscribers = new Set();
    get data() {
        if (this.state === State.Idle) {
            this.load();
        }
        return this.#data;
    }
    get state() {
        if (this.#loading) {
            return State.Loading;
        }
        if (this.#error) {
            return State.Errored;
        }
        if (this.#data) {
            return State.Complete;
        }
        return State.Idle;
    }
    get progress() {
        return this.#progress;
    }
    get loading() {
        return this.#loading;
    }
    get error() {
        return this.#error;
    }
    get promise() {
        return this.#promise;
    }
    updateProgress(progress) {
        this.#progress = progress;
        this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Progress));
    }
    async fetch(url, options) {
        const response = await fetch(url, options);
        const reader = response.body?.getReader();
        if (!reader) {
            return response;
        }
        const contentLength = response.headers.get("Content-Length");
        const total = contentLength
            ? Number.parseInt(contentLength, 10)
            : undefined;
        let received = 0;
        const updateProgress = options?.onProgress ?? this.updateProgress.bind(this);
        const stream = new ReadableStream({
            start(controller) {
                const pump = () => {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            updateProgress(1);
                            return;
                        }
                        received += value.byteLength;
                        typeof total === "number" && updateProgress(received / total);
                        controller.enqueue(value);
                        pump();
                    });
                };
                pump();
            },
        });
        return new Response(stream, {
            headers: response.headers,
            status: response.status,
        });
    }
    async load() {
        if (this.#loading) {
            return this.#promise;
        }
        this.#loading = true;
        this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Loading));
        try {
            const result = this.loader();
            if (result instanceof Promise) {
                this.#data = await result;
                this.#promise.resolve(this.#data);
            }
            else {
                this.#data = result;
                this.#promise.resolve(result);
            }
        }
        catch (e) {
            this.#error =
                e instanceof Error ? e : new Error("Unknown error loading asset");
            this.#promise.reject(this.#error);
            this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Error));
        }
        this.#progress = 1;
        this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Loaded));
        return this.#data;
    }
    subscribe(callback) {
        this.#subscribers.add(callback);
        return () => void this.#subscribers.delete(callback);
    }
    then(onfulfilled, onrejected) {
        return this.#promise.then(onfulfilled, onrejected);
    }
}
