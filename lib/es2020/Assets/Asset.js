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
var _Asset_eventDispatcher, _Asset_future, _Asset_loading, _Asset_loaded, _Asset_started, _Asset_progress, _Asset_data, _Asset_error;
import { Future } from "../Containers/Future.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { clamp } from "../Math/Other.js";
import { BeginLoadEvent, LoadedEvent, ErrorEvent, ProgressEvent } from "../Events/Event.js";
export class Asset {
    get data() { if (!__classPrivateFieldGet(this, _Asset_started, "f"))
        this.load(); return __classPrivateFieldGet(this, _Asset_data, "f"); }
    get error() { return __classPrivateFieldGet(this, _Asset_error, "f"); }
    get loaded() { return __classPrivateFieldGet(this, _Asset_loaded, "f"); }
    get loading() { return __classPrivateFieldGet(this, _Asset_loading, "f"); }
    get progress() { return __classPrivateFieldGet(this, _Asset_progress, "f"); }
    constructor() {
        Object.defineProperty(this, "addEventListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "removeEventListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _Asset_eventDispatcher.set(this, void 0);
        _Asset_future.set(this, new Future(() => { }));
        _Asset_loading.set(this, false);
        _Asset_loaded.set(this, false);
        _Asset_started.set(this, false);
        _Asset_progress.set(this, 0);
        _Asset_data.set(this, void 0);
        _Asset_error.set(this, void 0);
        __classPrivateFieldSet(this, _Asset_eventDispatcher, new ElysiaEventDispatcher, "f");
        this.addEventListener = __classPrivateFieldGet(this, _Asset_eventDispatcher, "f").addEventListener.bind(__classPrivateFieldGet(this, _Asset_eventDispatcher, "f"));
        this.removeEventListener = __classPrivateFieldGet(this, _Asset_eventDispatcher, "f").removeEventListener.bind(__classPrivateFieldGet(this, _Asset_eventDispatcher, "f"));
        this.updateProgress = this.updateProgress.bind(this);
        this.load = this.load.bind(this);
        this.fetch = this.fetch.bind(this);
    }
    load() {
        if (!__classPrivateFieldGet(this, _Asset_started, "f")) {
            this.loadImpl();
        }
        return __classPrivateFieldGet(this, _Asset_future, "f");
    }
    async loadImpl() {
        __classPrivateFieldGet(this, _Asset_eventDispatcher, "f").dispatchEvent(new BeginLoadEvent);
        __classPrivateFieldSet(this, _Asset_started, true, "f");
        __classPrivateFieldSet(this, _Asset_loading, true, "f");
        __classPrivateFieldSet(this, _Asset_progress, 0, "f");
        __classPrivateFieldSet(this, _Asset_error, null, "f");
        try {
            const d = await this.loader();
            __classPrivateFieldSet(this, _Asset_data, d, "f");
            __classPrivateFieldGet(this, _Asset_eventDispatcher, "f").dispatchEvent(new LoadedEvent);
            __classPrivateFieldGet(this, _Asset_future, "f").resolve(d);
        }
        catch (e) {
            __classPrivateFieldSet(this, _Asset_error, e instanceof Error ? e : new Error(String(e)), "f");
            __classPrivateFieldSet(this, _Asset_loaded, true, "f");
            __classPrivateFieldSet(this, _Asset_loading, false, "f");
            __classPrivateFieldGet(this, _Asset_eventDispatcher, "f").dispatchEvent(new ErrorEvent(this.error));
            __classPrivateFieldGet(this, _Asset_future, "f").reject(e);
        }
        finally {
            __classPrivateFieldSet(this, _Asset_loading, false, "f");
            __classPrivateFieldSet(this, _Asset_loaded, true, "f");
            __classPrivateFieldSet(this, _Asset_progress, 1, "f");
        }
    }
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
        __classPrivateFieldSet(this, _Asset_progress, clamp(progress, 0, 1), "f");
        __classPrivateFieldGet(this, _Asset_eventDispatcher, "f").dispatchEvent(new ProgressEvent(__classPrivateFieldGet(this, _Asset_progress, "f")));
    }
}
_Asset_eventDispatcher = new WeakMap(), _Asset_future = new WeakMap(), _Asset_loading = new WeakMap(), _Asset_loaded = new WeakMap(), _Asset_started = new WeakMap(), _Asset_progress = new WeakMap(), _Asset_data = new WeakMap(), _Asset_error = new WeakMap();
