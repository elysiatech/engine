import { ResolvablePromise } from "../Utils/ResolvablePromise";

export enum State {
	Idle = 0,
	Loading = 1,
	Complete = 2,
	Errored = 3,
}

export enum StatusUpdateEvent {
	Loading = 0,
	Loaded = 1,
	Error = 2,
	Progress = 3,
}

export abstract class Asset<AssetData> implements PromiseLike<AssetData> {
	
	#data?: AssetData;

	#progress = 0;

	#error?: Error;

	#loading = false;

	#complete = false;

	#promise = new ResolvablePromise<AssetData>();

	#subscribers = new Set<(status: StatusUpdateEvent) => void>();

	get data(): AssetData | undefined {
		if (this.state === State.Idle) {
			this.load();
		}
		return this.#data;
	}

	get state(): State {
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

	protected abstract loader(): AssetData | Promise<AssetData>;

	protected updateProgress(progress: number) {
		this.#progress = progress;
		this.#subscribers.forEach((callback) =>
			callback(StatusUpdateEvent.Progress),
		);
	}

	protected async fetch(
		url: string,
		options?: RequestInit & { onProgress?: (progress: number) => void },
	) {
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

		const updateProgress =
			options?.onProgress ?? this.updateProgress.bind(this);

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

	public async load(): Promise<AssetData> {
		if (this.#loading) {
			return this.#promise;
		}

		this.#loading = true;

		this.#subscribers.forEach((callback) =>
			callback(StatusUpdateEvent.Loading),
		);

		try {
			const result = this.loader();
			if (result instanceof Promise) {
				this.#data = await result;
				this.#promise.resolve(this.#data);
			} else {
				this.#data = result;
				this.#promise.resolve(result);
			}
		} catch (e) {
			this.#error =
				e instanceof Error ? e : new Error("Unknown error loading asset");
			this.#promise.reject(this.#error);
			this.#subscribers.forEach((callback) =>
				callback(StatusUpdateEvent.Error),
			);
		}
		this.#progress = 1;
		this.#subscribers.forEach((callback) => callback(StatusUpdateEvent.Loaded));

		return this.#data!;
	}

	public subscribe(callback: (status: StatusUpdateEvent) => void): () => void {
		this.#subscribers.add(callback);

		return () => void this.#subscribers.delete(callback);
	}

	public then<TResult1 = AssetData, TResult2 = never>(
		onfulfilled?:
			| ((value: AssetData) => TResult1 | PromiseLike<TResult1>)
			| undefined
			| null,
		onrejected?:
			| ((reason: any) => TResult2 | PromiseLike<TResult2>)
			| undefined
			| null,
	): Promise<TResult1 | TResult2> {
		return this.#promise.then(onfulfilled, onrejected);
	}
}
