/**
 * A map of references to objects.
 */
export class RefMap {
    constructor() {
        Object.defineProperty(this, "map", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map
        });
        Object.defineProperty(this, "i_values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map
        });
    }
    /**
     * Adds a reference to the map.
     * @param value The value to add.
     */
    add(value) {
        const ref = new WeakRef(value);
        this.map.set(value, ref);
        this.i_values.set(ref, value);
        return ref;
    }
    /**
     * Removes a reference from the map.
     * @param value The value to remove.
     */
    delete(value) {
        const ref = value instanceof WeakRef ? value : this.map.get(value);
        if (ref) {
            this.map.delete(this.i_values.get(ref));
            this.i_values.delete(ref);
        }
    }
    /**
     * Checks if a reference is in the map.
     * @param value The reference to check.
     * @returns True if the reference is in the map, false otherwise.
     */
    has(value) {
        return value instanceof WeakRef ? this.i_values.has(value) : this.map.has(value);
    }
    /**
     * Dereferences a reference.
     * WARNING: Dangerous, only use if you know what you are doing.
     * @param value
     */
    deref(value) {
        return this.i_values.get(value);
    }
    /**
     * Returns an iterator over the references in the map.
     * @returns An iterator over the references in the map.
     */
    values() {
        return this.map.values();
    }
}
