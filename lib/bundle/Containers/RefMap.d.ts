/**
 * A map of references to objects.
 */
export declare class RefMap<T extends WeakKey> {
    /**
     * Adds a reference to the map.
     * @param value The value to add.
     */
    add(value: T): WeakRef<T>;
    /**
     * Removes a reference from the map.
     * @param value The value to remove.
     */
    delete(value: WeakRef<T> | T): void;
    /**
     * Checks if a reference is in the map.
     * @param value The reference to check.
     * @returns True if the reference is in the map, false otherwise.
     */
    has(value: WeakRef<T> | T): boolean;
    /**
     * Dereferences a reference.
     * WARNING: Dangerous, only use if you know what you are doing.
     * @param value
     */
    deref(value: WeakRef<T>): T | undefined;
    /**
     * Returns an iterator over the references in the map.
     * @returns An iterator over the references in the map.
     */
    values(): IterableIterator<WeakRef<T>>;
    private readonly map;
    private readonly i_values;
}
