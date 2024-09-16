import { ResolvablePromise } from "../Utils/ResolvablePromise";
import { State, StatusUpdateEvent } from "./Asset";
export class AssetLoader {
    assets;
    #state = State.Idle;
    #progress = 0;
    #loading = false;
    #promise = new ResolvablePromise();
    #subscribers = new Set();
    #result = {};
    subscribe(callback) {
        this.#subscribers.add(callback);
        return () => void this.#subscribers.delete(callback);
    }
    get progress() {
        return this.#progress;
    }
    get state() {
        return this.#state;
    }
    get loading() {
        return this.#loading;
    }
    get data() {
        return this.#result;
    }
    constructor(assets) {
        this.assets = assets;
    }
    async load() {
        if (this.#loading) {
            return this.#promise;
        }
        this.#loading = true;
        this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Loading));
        const promises = [];
        for (const [name, asset] of Object.entries(this.assets)) {
            asset.subscribe((status) => {
                if (status === StatusUpdateEvent.Loaded) {
                    this.#result[name] = asset.data;
                }
                if (status === StatusUpdateEvent.Error) {
                    this.#promise.reject(new Error(`Error loading asset ${name}`));
                }
                if (status === StatusUpdateEvent.Progress) {
                    this.#progress =
                        Object.values(this.assets).reduce((acc, a) => acc + a.progress, 0) /
                            Object.keys(this.assets).length;
                    this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Progress));
                }
            });
            promises.push(asset.load());
        }
        try {
            await Promise.all(promises);
            this.#state = State.Complete;
            this.#loading = false;
            this.#progress = 1;
            this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Progress));
            this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Loaded));
            this.#promise.resolve(this.#result);
        }
        catch (e) {
            this.#state = State.Errored;
            this.#loading = false;
            this.#promise.reject(e instanceof Error ? e : new Error("Unknown error loading assets"));
            this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Error));
        }
        return this.#result;
    }
}
