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
