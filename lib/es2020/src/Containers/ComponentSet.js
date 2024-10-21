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
var _ComponentSet_first, _ComponentSet_last;
/**
 * SparseSet is a data structure that is used to store a set of unique values.
 * It is backed by a dense array and a sparse map.
 * The dense array stores the values in contiguous memory, while the sparse map
 * stores the index of each value in the dense array.
 * This means it is possible to look up the index of a value in constant time.
 * However, the set does not guarantee the order of the values.
 */
export class ComponentSet extends Set {
    constructor() {
        super(...arguments);
        _ComponentSet_first.set(this, void 0);
        _ComponentSet_last.set(this, void 0);
    }
    /**
     * Returns the first element in the set or undefined if the set is empty.
     * `O(1)` complexity.
     */
    get first() {
        return __classPrivateFieldGet(this, _ComponentSet_first, "f");
    }
    /**
     * Returns the last element in the set or undefined if the set is empty.
     * Potentially `O(n)` complexity.
     */
    get last() {
        let result;
        if (__classPrivateFieldGet(this, _ComponentSet_last, "f"))
            result = __classPrivateFieldGet(this, _ComponentSet_last, "f");
        else
            for (const value of this)
                result = value;
        __classPrivateFieldSet(this, _ComponentSet_last, result, "f");
        return result;
    }
    add(value) {
        const result = super.add(value);
        if (result && this.size === 1) {
            __classPrivateFieldSet(this, _ComponentSet_first, value, "f");
            __classPrivateFieldSet(this, _ComponentSet_last, value, "f");
        }
        else if (result)
            __classPrivateFieldSet(this, _ComponentSet_last, value, "f");
        return result;
    }
    delete(value) {
        const result = super.delete(value);
        if (!result)
            return result;
        if (this.size === 0) {
            __classPrivateFieldSet(this, _ComponentSet_first, undefined, "f");
            __classPrivateFieldSet(this, _ComponentSet_last, undefined, "f");
        }
        else {
            if (value === __classPrivateFieldGet(this, _ComponentSet_first, "f"))
                __classPrivateFieldSet(this, _ComponentSet_first, this.values()?.next()?.value, "f");
            if (result && value === __classPrivateFieldGet(this, _ComponentSet_last, "f"))
                __classPrivateFieldSet(this, _ComponentSet_last, undefined, "f");
        }
        return result;
    }
}
_ComponentSet_first = new WeakMap(), _ComponentSet_last = new WeakMap();
