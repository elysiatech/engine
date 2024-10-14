export class ReverseMap extends Map {
    getKey(value) {
        return this.#reverse.get(value);
    }
    set(key, value) {
        super.set(key, value);
        this.#reverse.set(value, key);
        return this;
    }
    #reverse = new Map();
}
