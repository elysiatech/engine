/**
 * Simple object pool implementation.
 * The pool will automatically grow if it runs out of objects (double the size).
 * @template T The type of object to pool.
 */
export declare class ObjectPool<T> {
    private factory;
    /**
     * Creates a new object pool.
     * @param factory A function that creates a new object of type T.
     * @param initialAlloc The initial number of objects to allocate.
     */
    constructor(factory: () => T, initialAlloc?: number);
    /**
     * Allocates an object from the pool.
     * @returns An object of type T.
     */
    alloc(): T;
    /**
     * Frees an object back into the pool.
     * @param obj The object to free.
     */
    free(obj: T): void;
    private metrics;
    private pool;
}
