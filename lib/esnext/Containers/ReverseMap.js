/**
 * A Map that allows for reverse lookups of keys by values.
 */
export class ReverseMap extends Map {
    /** Get the key for a given value. If the value does not exist in the map, returns undefined. */
    getKey(value) {
        return this.#reverse.get(value);
    }
    set(key, value) {
        super.set(key, value);
        this.#reverse.set(value, key);
        return this;
    }
    #reverse = new Map();
}
