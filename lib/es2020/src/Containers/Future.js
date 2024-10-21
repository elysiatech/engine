var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Future_instances, _Future_promise, _Future_syncValue, _Future_state, _Future_resolveValue, _a;
/**
 * A custom implementation of the Promise class that allows for synchronous access to the resolved value.
 * This is useful for cases where a promise is resolved synchronously, but the value is needed immediately.
 * It can also be resolved or rejected externally.
 * @template T The type of the resolved value.
 */
export class Future {
    /**
     * Get the current state of the promise.
     */
    get state() {
        return __classPrivateFieldGet(this, _Future_state, "f");
    }
    /**
     * Get the value of the promise synchronously, undefined if pending.
     */
    get value() {
        return __classPrivateFieldGet(this, _Future_syncValue, "f");
    }
    constructor(executor) {
        _Future_instances.add(this);
        /**
         * Resolve the promise with the given value.
         */
        Object.defineProperty(this, "resolve", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Reject the promise with the given reason.
         */
        Object.defineProperty(this, "reject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, _a, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Promise'
        });
        _Future_promise.set(this, void 0);
        _Future_syncValue.set(this, void 0);
        _Future_state.set(this, 'pending');
        __classPrivateFieldSet(this, _Future_promise, new Promise((res, rej) => {
            this.resolve = async (value) => {
                await __classPrivateFieldGet(this, _Future_instances, "m", _Future_resolveValue).call(this, value);
                res(value);
            };
            this.reject = (reason) => {
                __classPrivateFieldSet(this, _Future_state, 'rejected', "f");
                rej(reason);
            };
            executor(this.resolve, this.reject);
        }), "f");
    }
    then(onfulfilled, onrejected) {
        return __classPrivateFieldGet(this, _Future_promise, "f").then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return __classPrivateFieldGet(this, _Future_promise, "f").catch(onrejected);
    }
    finally(onfinally) {
        return __classPrivateFieldGet(this, _Future_promise, "f").finally(onfinally);
    }
}
_Future_promise = new WeakMap(), _Future_syncValue = new WeakMap(), _Future_state = new WeakMap(), _Future_instances = new WeakSet(), _a = Symbol.toStringTag, _Future_resolveValue = async function _Future_resolveValue(value) {
    try {
        __classPrivateFieldSet(this, _Future_syncValue, await value, "f");
        __classPrivateFieldSet(this, _Future_state, 'fulfilled', "f");
    }
    catch (error) {
        __classPrivateFieldSet(this, _Future_state, 'rejected', "f");
    }
};
