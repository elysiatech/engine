export class ResolvablePromise<T> implements Promise<T> {
	#resolve!: (value: T) => void;
	#reject!: (error: Error) => void;
	#promise = new Promise<T>((resolve, reject) => {
		this.#resolve = resolve;
		this.#reject = reject;
	});

	resolve(value: T) {
		this.#resolve(value);
	}

	reject(error: Error) {
		this.#reject(error);
	}

	then<TResult1 = T, TResult2 = never>(
		onfulfilled?:
			| ((value: T) => PromiseLike<TResult1> | TResult1)
			| undefined
			| null,
		onrejected?:
			| ((reason: any) => PromiseLike<TResult2> | TResult2)
			| undefined
			| null,
	): Promise<TResult1 | TResult2> {
		return this.#promise.then(onfulfilled, onrejected);
	}

	catch<TResult = never>(
		onrejected?:
			| ((reason: any) => PromiseLike<TResult> | TResult)
			| undefined
			| null,
	): Promise<T | TResult> {
		return this.#promise.catch(onrejected);
	}

	finally(onfinally?: (() => void) | undefined | null): Promise<T> {
		return this.#promise.finally(onfinally);
	}

	[Symbol.toStringTag] = "ResolvablePromise";
}