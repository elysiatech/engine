export declare class ReverseMap<K, V> extends Map<K, V> {
    #private;
    getKey(value: V): K | undefined;
    set(key: K, value: V): this;
}
