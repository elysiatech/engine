export class ResolvablePromise {
    #resolve;
    #reject;
    #promise = new Promise((resolve, reject) => {
        this.#resolve = resolve;
        this.#reject = reject;
    });
    resolve(value) {
        this.#resolve(value);
    }
    reject(error) {
        this.#reject(error);
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
    [Symbol.toStringTag] = "ResolvablePromise";
}
