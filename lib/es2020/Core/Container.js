var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Container_instances, _Container_resolveTransient, _Container_resolveSingleton, _Container_resolveValue;
function mapPredicate(map, predicate) {
    return Array.from(map).filter(([key, value]) => predicate(key, value) ? [key, value] : undefined).filter(Boolean);
}
/****************************************************************************************
 * Injection Keys
 *****************************************************************************************/
export class InjectionKey {
    constructor(brand = {}) {
        Object.defineProperty(this, "brand", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: brand
        });
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
    constructor() {
        _Container_instances.add(this);
        Object.defineProperty(this, "instances", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "singletons", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
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
    resolve(key) {
        const prev = Container.current;
        Container.current = this;
        try {
            const value = __classPrivateFieldGet(this, _Container_instances, "m", _Container_resolveSingleton).call(this, key) ?? __classPrivateFieldGet(this, _Container_instances, "m", _Container_resolveTransient).call(this, key) ?? __classPrivateFieldGet(this, _Container_instances, "m", _Container_resolveValue).call(this, key);
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
_Container_instances = new WeakSet(), _Container_resolveTransient = function _Container_resolveTransient(key) {
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
}, _Container_resolveSingleton = function _Container_resolveSingleton(key) {
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
}, _Container_resolveValue = function _Container_resolveValue(key) {
    console.log(key, this.values);
    return this.values.get(key);
};
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
