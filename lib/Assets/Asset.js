import { Future } from "../Containers/Future";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { clamp } from "../Math/Other";
import { BeginLoadEvent, LoadedEvent, ErrorEvent, ProgressEvent } from "../Events/Event";
export class Asset {
    get data() { if (!this.#started)
        this.load(); return this.#data; }
    get error() { return this.#error; }
    get loaded() { return this.#loaded; }
    get loading() { return this.#loading; }
    get progress() { return this.#progress; }
    constructor() {
        this.#eventDispatcher = new ElysiaEventDispatcher;
        this.addEventListener = this.#eventDispatcher.addEventListener.bind(this.#eventDispatcher);
        this.removeEventListener = this.#eventDispatcher.removeEventListener.bind(this.#eventDispatcher);
        this.updateProgress = this.updateProgress.bind(this);
        this.load = this.load.bind(this);
        this.fetch = this.fetch.bind(this);
    }
    load() {
        if (!this.#started) {
            this.loadImpl();
        }
        return this.#future;
    }
    async loadImpl() {
        this.#eventDispatcher.dispatchEvent(new BeginLoadEvent);
        this.#started = true;
        this.#loading = true;
        this.#progress = 0;
        this.#error = null;
        try {
            const d = await this.loader();
            this.#data = d;
            this.#eventDispatcher.dispatchEvent(new LoadedEvent);
            this.#future.resolve(d);
        }
        catch (e) {
            this.#error = e instanceof Error ? e : new Error(String(e));
            this.#loaded = true;
            this.#loading = false;
            this.#eventDispatcher.dispatchEvent(new ErrorEvent(this.error));
            this.#future.reject(e);
        }
        finally {
            this.#loading = false;
            this.#loaded = true;
            this.#progress = 1;
        }
    }
    addEventListener;
    removeEventListener;
    async fetch(url, options) {
        const response = await fetch(url, options);
        const reader = response.body?.getReader();
        if (!reader)
            return response;
        const contentLength = response.headers.get("Content-Length");
        const total = contentLength
            ? Number.parseInt(contentLength, 10)
            : undefined;
        let received = 0;
        const updateProgress = options?.onProgress ?? this.updateProgress;
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
    updateProgress(progress) {
        this.#progress = clamp(progress, 0, 1);
        this.#eventDispatcher.dispatchEvent(new ProgressEvent(this.#progress));
    }
    #eventDispatcher;
    #future = new Future(() => { });
    #loading = false;
    #loaded = false;
    #started = false;
    #progress = 0;
    #data;
    #error;
}
