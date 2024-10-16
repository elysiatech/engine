/**
 * SparseSet is a data structure that is used to store a set of unique values.
 * It is backed by a dense array and a sparse map.
 * The dense array stores the values in contiguous memory, while the sparse map
 * stores the index of each value in the dense array.
 * This means it is possible to look up the index of a value in constant time.
 * However, the set does not guarantee the order of the values.
 */
export declare class ComponentSet<T> {
    /**
     * Returns the first element in the set or undefined if the set is empty.
     */
    get first(): T | undefined;
    /**
     * Returns the last element in the set or undefined if the set is empty.
     */
    get last(): T | undefined;
    /**
     * Adds a value to the set.
     * @param value The value to add.
     */
    add(value: T): void;
    /**
     * Removes a value from the set.
     * @param value The value to remove.
     */
    delete(value: T): void;
    /**
     * Checks if a value is in the set.
     * @param value The value to check.
     * @returns True if the value is in the set, false otherwise.
     */
    has(value: T): boolean;
    /**
     * Returns an iterator over the values in the set.
     * @returns An iterator over the values in the set.
     */
    values(): IterableIterator<T>;
    /**
     * Map the values of the set to a new array.
     * @param callback
     */
    map<U>(callback: (value: T) => U): U[];
    /**
     * Iterate over the values of the set.
     * @param callback
     */
    forEach(callback: (value: T) => void): void;
    /**
     * Filter the values of the set.
     * @param callback
     */
    filter(callback: (value: T) => boolean): T[];
    /**
     * Returns the value at the given index in the set.
     * @param index The index of the value to return.
     * @returns The value at the given index, or undefined if the index is out of bounds.
     */
    at(index: number): T | undefined;
    [Symbol.iterator](): Generator<T, void, unknown>;
    /** * Clears the set */
    clear(): void;
    get length(): number;
    private dense;
    private sparse;
}
