/**
 * SparseSet is a data structure that is used to store a set of unique values.
 * It is backed by a dense array and a sparse map.
 * The dense array stores the values in contiguous memory, while the sparse map
 * stores the index of each value in the dense array.
 * This means it is possible to look up the index of a value in constant time.
 * However, the set does not guarantee the order of the values.
 */
export declare class ComponentSet<T> extends Set<T> {
    #private;
    /**
     * Returns the first element in the set or undefined if the set is empty.
     * `O(1)` complexity.
     */
    get first(): T | undefined;
    /**
     * Returns the last element in the set or undefined if the set is empty.
     * Potentially `O(n)` complexity.
     */
    get last(): T | undefined;
    add(value: T): this;
    delete(value: T): boolean;
}
