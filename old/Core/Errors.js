export function toError(err) {
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
export function run(fn) {
    try {
        const value = fn();
        if (value instanceof Promise) {
            // @ts-ignore
            return new Promise((res) => {
                value.then((val) => res(val)).catch((err) => res(toError(err)));
            });
        }
        else {
            // @ts-ignore
            return value;
        }
    }
    catch (e) {
        // @ts-ignore
        return toError(e);
    }
}
