export class ReverseMap<K, V> extends Map<K, V> {
	public getKey(value: V): K | undefined {
		return this.#reverse.get(value);
	}

	override set(key: K, value: V): this {
		super.set(key, value);
		this.#reverse.set(value, key);
		return this;
	}

	#reverse = new Map<V, K>();
}