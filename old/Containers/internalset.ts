/*
Read-only Set-like objects have the property size, and the methods: 
entries(), forEach(), has(), keys(), values(), and [Symbol.iterator]().
*/

export function createReadonlySet<T>(key: symbol) {

	return class ReadOnlySet<T> {

		public get size() { return this.#internalSet.size; }

		public entries() {
			return this.#internalSet.entries();
		}

		public forEach(callbackfn: (value: T, value2: T, set: ReadOnlySet<T>) => void, thisArg?: any) {
			// @ts-ignore
			return this.#internalSet.forEach(callbackfn, thisArg);
		}

		public has(value: T) {
			return this.#internalSet.has(value);
		}

		public keys() {
			return this.#internalSet.keys();
		}

		public values() {
			return this.#internalSet.values();
		}

		public [Symbol.iterator]() {
			return this.#internalSet[Symbol.iterator]();
		}

		get [key](){ return this.#internalSet }

		#internalSet = new Set<T>
	}
}


const ContainerSymbol = Symbol();

const Container = createReadonlySet<string>(ContainerSymbol);

const c = new Container();

const internal = c[ContainerSymbol];

internal.add('hello');

for(const s of c) console.log(s)

