/**
 * A custom implementation of the Promise class that allows for synchronous access to the resolved value.
 * This is useful for cases where a promise is resolved synchronously, but the value is needed immediately.
 * It can also be resolved or rejected externally.
 * @template T The type of the resolved value.
 */
export class Future {
    /**
     * Resolve the promise with the given value.
     */
    resolve;
    /**
     * Reject the promise with the given reason.
     */
    reject;
    /**
     * Get the current state of the promise.
     */
    get state() {
        return this.#state;
    }
    /**
     * Get the value of the promise synchronously, undefined if pending.
     */
    get value() {
        return this.#syncValue;
    }
    [Symbol.toStringTag] = 'Promise';
    constructor(executor) {
        this.#promise = new Promise((res, rej) => {
            this.resolve = async (value) => {
                await this.#resolveValue(value);
                res(value);
            };
            this.reject = (reason) => {
                this.#state = 'rejected';
                rej(reason);
            };
            executor(this.resolve, this.reject);
        });
    }
    then(onfulfilled, onrejected) {
        return this.#promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.#promise.catch(onrejected);
    }
    finally(onfinally) {
        return this.#promise.finally(onfinally);
    }
    #promise;
    #syncValue;
    #state = 'pending';
    async #resolveValue(value) {
        try {
            this.#syncValue = await value;
            this.#state = 'fulfilled';
        }
        catch (error) {
            this.#state = 'rejected';
        }
    }
}
