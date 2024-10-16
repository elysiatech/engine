import { isDev } from "./Asserts.js";
export class LifeCycleError extends Error {
    constructor(method, target, cause) {
        super(`Lifecycle error in component: ${String(target.constructor.name)} during ${stripSymbolAndElysia(String(method))}: \n${cause.message}`, { cause });
    }
}
export function reportLifecycleError(value, { kind, name }) {
    if (!isDev())
        return value;
    if (kind === "method") {
        return function (...args) {
            let ret;
            try {
                ret = value.call(this, ...args);
            }
            catch (err) {
                if (err instanceof LifeCycleError) {
                    err.message = err.message.replace(":", `: ${String(this.constructor.name)} ->`);
                    throw err;
                }
                throw new LifeCycleError(name, this, err);
            }
            return ret;
        };
    }
}
function stripSymbolAndElysia(str) {
    if (str.startsWith("Symbol(Elysia::")) {
        return str.slice(15, -1);
    }
    else
        return str;
}
