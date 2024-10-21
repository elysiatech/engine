function mapPredicate(map, predicate) {
    return Array.from(map).filter(([key, value]) => predicate(key, value) ? [key, value] : undefined).filter(Boolean);
}
/****************************************************************************************
 * Injection Keys
 *****************************************************************************************/
export class InjectionKey {
    brand;
    constructor(brand = {}) {
        this.brand = brand;
    }
}
/****************************************************************************************
 * Container
 *****************************************************************************************/
export class OutOfScopeError extends Error {
}
export class ResolutionError extends Error {
}
export class Container {
    static current;
    instances = new Map();
    singletons = new Map();
    values = new Map();
    registerTransient(key, value) {
        if (value) {
            this.instances.set(key, value);
        }
        else {
            this.instances.set(key, key);
        }
    }
    registerSingleton(key, value) {
        this.singletons.set(key, { instance: value ?? key, resolved: false });
    }
    registerValue(key, value) {
        this.values.set(key, value);
    }
    #resolveTransient(key) {
        const instance = this.instances.get(key)
            || mapPredicate(this.instances, (k) => typeof k === "function" && key instanceof k)[0]?.[1];
        if (instance) {
            try {
                return new instance();
            }
            catch {
                throw new ResolutionError(`Could not resolve ${String(key)}`);
            }
        }
    }
    #resolveSingleton(key) {
        const singleton = this.singletons.get(key)
            || mapPredicate(this.singletons, (k) => typeof k === "function" && key instanceof k)[0]?.[1];
        if (!singleton)
            return;
        if (!singleton.resolved) {
            const instance = singleton.instance;
            singleton.instance = new instance();
            singleton.resolved = true;
        }
        return singleton.instance;
    }
    #resolveValue(key) {
        console.log(key, this.values);
        return this.values.get(key);
    }
    resolve(key) {
        const prev = Container.current;
        Container.current = this;
        try {
            const value = this.#resolveSingleton(key) ?? this.#resolveTransient(key) ?? this.#resolveValue(key);
            if (!value)
                throw new ResolutionError(`Could not resolve ${String(key)}`);
            return value;
        }
        finally {
            Container.current = prev;
        }
    }
    resolveSafe(key) {
        try {
            return this.resolve(key);
        }
        catch {
            return undefined;
        }
    }
}
export function inject(key) {
    if (!Container.current)
        throw new OutOfScopeError('No container in scope');
    return Container.current.resolve(key);
}
export function injectSafe(key) {
    if (!Container.current)
        return undefined;
    return Container.current.resolveSafe(key);
}
