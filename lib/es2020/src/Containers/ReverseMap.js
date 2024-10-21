var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ReverseMap_reverse;
/**
 * A Map that allows for reverse lookups of keys by values.
 */
export class ReverseMap extends Map {
    constructor() {
        super(...arguments);
        _ReverseMap_reverse.set(this, new Map());
    }
    /** Get the key for a given value. If the value does not exist in the map, returns undefined. */
    getKey(value) {
        return __classPrivateFieldGet(this, _ReverseMap_reverse, "f").get(value);
    }
    set(key, value) {
        super.set(key, value);
        __classPrivateFieldGet(this, _ReverseMap_reverse, "f").set(value, key);
        return this;
    }
}
_ReverseMap_reverse = new WeakMap();
