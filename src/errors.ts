export function toError(err: unknown) {
	if (err instanceof Error) {
		return err;
	}
	if (typeof err === "string") {
		return new Error(err);
	}
	return new Error(String(err));
}

/**
 * Immediately runs the provided function, catching and returning all uncaught exceptions.
 */
export function run<T>(
	fn: () => T,
): T extends Promise<any> ? Promise<Error | Awaited<T>> : Error | T {
	try {
		const value = fn();
		if (value instanceof Promise) {
			// @ts-ignore
			return new Promise((res) => {
				value.then((val) => res(val)).catch((err) => res(toError(err)));
			});
		} else {
			// @ts-ignore
			return value;
		}
	} catch (e) {
		// @ts-ignore
		return toError(e);
	}
}

const RESULT_BRAND = Symbol("RESULT_BRAND");

export type Result<T> =
	| {
			success: false;
			error: Error;
			value: undefined;
	  }
	| {
			success: true;
			error: undefined;
			value: T;
	  };

/**
 * Immediately runs the provided function,
 * returning a result object that includes the success status,
 * the value returned by the function, and any error that was thrown.
 */
export function result<T>(
	fn: () => T,
): T extends Promise<any> ? Promise<Result<Awaited<T>>> : Result<T> {
	try {
		const value = fn();
		if (value instanceof Promise) {
			// @ts-ignore
			return new Promise((res) => {
				value
					.then((value) =>
						// @ts-ignore
						res({ success: true, value, error: undefined, RESULT_BRAND: true }),
					)
					.catch((err) =>
						res({
							success: false,
							error: toError(err),
							value: undefined,
							// @ts-ignore
							RESULT_BRAND: true,
						}),
					);
			});
		} else {
			// @ts-ignore
			return {
				success: true,
				error: undefined,
				value: value,
				RESULT_BRAND: true,
			};
		}
	} catch (e) {
		// @ts-ignore
		return {
			success: false,
			error: toError(e),
			value: undefined,
			RESULT_BRAND: true,
		};
	}
}

export function isResult<T>(input: unknown): input is Result<T> {
	// @ts-ignore
	return !!input && typeof input === "object" && input[RESULT_BRAND] === true;
}
