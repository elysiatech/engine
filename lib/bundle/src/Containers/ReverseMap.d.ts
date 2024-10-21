/**
 * A Map that allows for reverse lookups of keys by values.
 */
export declare class ReverseMap<K, V> extends Map<K, V> {
    #private;
    /** Get the key for a given value. If the value does not exist in the map, returns undefined. */
    getKey(value: V): K | undefined;
    set(key: K, value: V): this;
}
