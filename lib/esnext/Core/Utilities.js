export function toBoolean(val) { return val ? val !== "false" : false; }
export function toError(err) {
    if (err instanceof Error) {
        return err;
    }
    if (typeof err === 'string') {
        return new Error(err);
    }
    return new Error(String(err));
}
export function noop() { }
export function tick(callback) {
    // @ts-ignore
    if (typeof callback === "function")
        return void setTimeout(callback);
    // @ts-ignore
    else
        return new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve)));
}
/**
 * Binds a method to the instance of the class it is defined in.
 */
export const bound = (recever, { name, addInitializer }) => {
    addInitializer(function () {
        this[name] = this[name].bind(this);
    });
};
