/**
 * A custom implementation of the Promise class that allows for synchronous access to the resolved value.
 * This is useful for cases where a promise is resolved synchronously, but the value is needed immediately.
 * It can also be resolved or rejected externally.
 * @template T The type of the resolved value.
 */
export declare class Future<T> implements Promise<T> {
    #private;
    /**
     * Resolve the promise with the given value.
     */
    resolve: (value: T | PromiseLike<T>) => void;
    /**
     * Reject the promise with the given reason.
     */
    reject: (reason?: any) => void;
    /**
     * Get the current state of the promise.
     */
    get state(): 'pending' | 'fulfilled' | 'rejected';
    /**
     * Get the value of the promise synchronously, undefined if pending.
     */
    get value(): T | undefined;
    [Symbol.toStringTag]: string;
    constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
