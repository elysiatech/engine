import { ResolvablePromise } from "../Utils/ResolvablePromise";
import { Asset, State, StatusUpdateEvent } from "./Asset";

type UnwrapAsset<T extends Asset<any>> = T extends Asset<infer U> ? U : never;

type UnwrapAssetMap<T extends Record<string, Asset<any>>> = {
	[K in keyof T]: UnwrapAsset<T[K]>;
};

export class AssetLoader<Assets extends Record<string, Asset<any>>> {
	#state: State = State.Idle;
	#progress = 0;
	#loading = false;

	#promise = new ResolvablePromise<UnwrapAssetMap<Assets>>();

	#subscribers = new Set<(status: StatusUpdateEvent) => void>();

	#result: UnwrapAssetMap<Assets> = {} as UnwrapAssetMap<Assets>;

	subscribe(callback: (status: StatusUpdateEvent) => void): () => void {
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

	constructor(protected assets: Assets) {
	}

	async load() {
		if (this.#loading) {
			return this.#promise;
		}

		this.#loading = true;

		this.#subscribers.forEach((callback) =>
			callback(StatusUpdateEvent.Loading),
		);

		const promises: Promise<any>[] = [];

		for (const [name, asset] of Object.entries(this.assets)) {
			asset.subscribe((status) => {
				if (status === StatusUpdateEvent.Loaded) {
					this.#result[name as keyof typeof this.assets] = asset.data;
				}

				if (status === StatusUpdateEvent.Error) {
					this.#promise.reject(new Error(`Error loading asset ${name}`));
				}

				if (status === StatusUpdateEvent.Progress) {
					this.#progress =
						Object.values(this.assets).reduce((acc, a) => acc + a.progress, 0) /
						Object.keys(this.assets).length;
					this.#subscribers.forEach((callback) =>
						callback(StatusUpdateEvent.Progress),
					);
				}
			});

			promises.push(asset.load());
		}

		try {
			await Promise.all(promises);
			this.#state = State.Complete;
			this.#loading = false;
			this.#progress = 1;
			this.#subscribers.forEach((callback) =>
				callback(StatusUpdateEvent.Progress),
			);
			this.#subscribers.forEach((callback) =>
				callback(StatusUpdateEvent.Loaded),
			);
			this.#promise.resolve(this.#result);
		} catch (e) {
			this.#state = State.Errored;
			this.#loading = false;
			this.#promise.reject(
				e instanceof Error ? e : new Error("Unknown error loading assets"),
			);
			this.#subscribers.forEach((callback) =>
				callback(StatusUpdateEvent.Error),
			);
		}

		return this.#result;
	}
}