import { isDev } from "../Core/Asserts.js";
export class LifeCycleError extends Error {
    constructor(method, target, cause) {
        super(`Lifecycle error in component: ${String(target.constructor.name)} during ${stripSymbolAndElysia(String(method))}: \n${cause.message}`, { cause });
    }
}
export const reportLifecycleError = (context, method, ...args) => {
    if (!isDev())
        return method.call(context, ...args);
    try {
        method.call(context, ...args);
    }
    catch (err) {
        if (err instanceof LifeCycleError) {
            // @ts-ignore
            err.message = err.message.replace(":", `: ${String(this.constructor.name)} ->`);
            throw err;
        }
        // @ts-ignore
        throw new LifeCycleError(name, this, err);
    }
};
function stripSymbolAndElysia(str) {
    if (str.startsWith("Symbol(Elysia::")) {
        return str.slice(15, -1);
    }
    else
        return str;
}
