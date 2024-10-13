import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { LoadedEvent, ProgressEvent, ErrorEvent } from "../Events/Event";
import { ELYSIA_LOGGER } from "../Core/Logger";
export class AssetLoader {
    get loading() { return this.#loading; }
    get loaded() { return this.#loaded; }
    get error() { return this.#error; }
    get progress() { return this.#progress; }
    constructor(assets) {
        this.#assets = assets;
        this.#eventDispatcher = new ElysiaEventDispatcher;
        this.addEventListener = this.#eventDispatcher.addEventListener.bind(this.#eventDispatcher);
        this.removeEventListener = this.#eventDispatcher.removeEventListener.bind(this.#eventDispatcher);
        this.load = this.load.bind(this);
        this.unwrap = this.unwrap.bind(this);
        this.get = this.get.bind(this);
    }
    load() {
        if (this.#loaded || this.#loading)
            return;
        this.#loading = true;
        ELYSIA_LOGGER.debug("Loading assets", this.#assets);
        const promises = Object.values(this.#assets).map(asset => {
            asset.addEventListener(ProgressEvent, () => {
                const len = Object.keys(this.#assets).length;
                this.#progress = Object.values(this.#assets).reduce((acc, a) => acc + a.progress, 0) / len;
                this.#eventDispatcher.dispatchEvent(new ProgressEvent(this.#progress));
            });
            return asset.load();
        });
        return Promise.all(promises).then(() => {
            this.#loaded = true;
            this.#loading = false;
            this.#progress = 1;
            this.#eventDispatcher.dispatchEvent(new LoadedEvent);
        }).catch(e => {
            ELYSIA_LOGGER.error('Error loading asset:', e);
            this.#error = e;
            this.#loading = false;
            this.#eventDispatcher.dispatchEvent(new ErrorEvent(e));
            throw e;
        });
    }
    unwrap(type, key) {
        if (!this.#loaded)
            throw new Error("Assets not loaded yet.");
        if (typeof key === "string") {
            const maybeAsset = this.#assets[key];
            if (!maybeAsset)
                throw new Error("Asset not found.");
            if (!(maybeAsset instanceof type))
                throw new Error("Asset type mismatch.");
            return maybeAsset.data;
        }
        else {
            const maybeAsset = this.#assets[type];
            if (!maybeAsset)
                throw new Error("Asset not found.");
            return maybeAsset.data;
        }
    }
    get(a) {
        return this.#assets[a];
    }
    addEventListener;
    removeEventListener;
    #eventDispatcher = new ElysiaEventDispatcher;
    #progress = 0;
    #loaded = false;
    #loading = false;
    #error = null;
    #assets;
}
