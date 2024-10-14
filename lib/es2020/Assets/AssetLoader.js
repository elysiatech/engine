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
var _AssetLoader_eventDispatcher, _AssetLoader_progress, _AssetLoader_loaded, _AssetLoader_loading, _AssetLoader_error, _AssetLoader_assets;
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { LoadedEvent, ProgressEvent, ErrorEvent } from "../Events/Event.js";
import { ELYSIA_LOGGER } from "../Core/Logger.js";
export class AssetLoader {
    get loading() { return __classPrivateFieldGet(this, _AssetLoader_loading, "f"); }
    get loaded() { return __classPrivateFieldGet(this, _AssetLoader_loaded, "f"); }
    get error() { return __classPrivateFieldGet(this, _AssetLoader_error, "f"); }
    get progress() { return __classPrivateFieldGet(this, _AssetLoader_progress, "f"); }
    constructor(assets) {
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
        _AssetLoader_eventDispatcher.set(this, new ElysiaEventDispatcher);
        _AssetLoader_progress.set(this, 0);
        _AssetLoader_loaded.set(this, false);
        _AssetLoader_loading.set(this, false);
        _AssetLoader_error.set(this, null);
        _AssetLoader_assets.set(this, void 0);
        __classPrivateFieldSet(this, _AssetLoader_assets, assets, "f");
        __classPrivateFieldSet(this, _AssetLoader_eventDispatcher, new ElysiaEventDispatcher, "f");
        this.addEventListener = __classPrivateFieldGet(this, _AssetLoader_eventDispatcher, "f").addEventListener.bind(__classPrivateFieldGet(this, _AssetLoader_eventDispatcher, "f"));
        this.removeEventListener = __classPrivateFieldGet(this, _AssetLoader_eventDispatcher, "f").removeEventListener.bind(__classPrivateFieldGet(this, _AssetLoader_eventDispatcher, "f"));
        this.load = this.load.bind(this);
        this.unwrap = this.unwrap.bind(this);
        this.get = this.get.bind(this);
    }
    load() {
        if (__classPrivateFieldGet(this, _AssetLoader_loaded, "f") || __classPrivateFieldGet(this, _AssetLoader_loading, "f"))
            return;
        __classPrivateFieldSet(this, _AssetLoader_loading, true, "f");
        ELYSIA_LOGGER.debug("Loading assets", __classPrivateFieldGet(this, _AssetLoader_assets, "f"));
        const promises = Object.values(__classPrivateFieldGet(this, _AssetLoader_assets, "f")).map(asset => {
            asset.addEventListener(ProgressEvent, () => {
                const len = Object.keys(__classPrivateFieldGet(this, _AssetLoader_assets, "f")).length;
                __classPrivateFieldSet(this, _AssetLoader_progress, Object.values(__classPrivateFieldGet(this, _AssetLoader_assets, "f")).reduce((acc, a) => acc + a.progress, 0) / len, "f");
                __classPrivateFieldGet(this, _AssetLoader_eventDispatcher, "f").dispatchEvent(new ProgressEvent(__classPrivateFieldGet(this, _AssetLoader_progress, "f")));
            });
            return asset.load();
        });
        return Promise.all(promises).then(() => {
            __classPrivateFieldSet(this, _AssetLoader_loaded, true, "f");
            __classPrivateFieldSet(this, _AssetLoader_loading, false, "f");
            __classPrivateFieldSet(this, _AssetLoader_progress, 1, "f");
            __classPrivateFieldGet(this, _AssetLoader_eventDispatcher, "f").dispatchEvent(new LoadedEvent);
        }).catch(e => {
            ELYSIA_LOGGER.error('Error loading asset:', e);
            __classPrivateFieldSet(this, _AssetLoader_error, e, "f");
            __classPrivateFieldSet(this, _AssetLoader_loading, false, "f");
            __classPrivateFieldGet(this, _AssetLoader_eventDispatcher, "f").dispatchEvent(new ErrorEvent(e));
            throw e;
        });
    }
    unwrap(type, key) {
        if (!__classPrivateFieldGet(this, _AssetLoader_loaded, "f"))
            throw new Error("Assets not loaded yet.");
        if (typeof key === "string") {
            const maybeAsset = __classPrivateFieldGet(this, _AssetLoader_assets, "f")[key];
            if (!maybeAsset)
                throw new Error("Asset not found.");
            if (!(maybeAsset instanceof type))
                throw new Error("Asset type mismatch.");
            return maybeAsset.data;
        }
        else {
            const maybeAsset = __classPrivateFieldGet(this, _AssetLoader_assets, "f")[type];
            if (!maybeAsset)
                throw new Error("Asset not found.");
            return maybeAsset.data;
        }
    }
    get(a) {
        return __classPrivateFieldGet(this, _AssetLoader_assets, "f")[a];
    }
}
_AssetLoader_eventDispatcher = new WeakMap(), _AssetLoader_progress = new WeakMap(), _AssetLoader_loaded = new WeakMap(), _AssetLoader_loading = new WeakMap(), _AssetLoader_error = new WeakMap(), _AssetLoader_assets = new WeakMap();
