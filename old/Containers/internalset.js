/*
Read-only Set-like objects have the property size, and the methods:
entries(), forEach(), has(), keys(), values(), and [Symbol.iterator]().
*/
export function createReadonlySet(key) {
    return class ReadOnlySet {
        get size() { return this.#internalSet.size; }
        entries() {
            return this.#internalSet.entries();
        }
        forEach(callbackfn, thisArg) {
            // @ts-ignore
            return this.#internalSet.forEach(callbackfn, thisArg);
        }
        has(value) {
            return this.#internalSet.has(value);
        }
        keys() {
            return this.#internalSet.keys();
        }
        values() {
            return this.#internalSet.values();
        }
        [Symbol.iterator]() {
            return this.#internalSet[Symbol.iterator]();
        }
        get [key]() { return this.#internalSet; }
        #internalSet = new Set;
    };
}
const ContainerSymbol = Symbol();
const Container = createReadonlySet(ContainerSymbol);
const c = new Container();
const internal = c[ContainerSymbol];
internal.add('hello');
for (const s of c)
    console.log(s);
