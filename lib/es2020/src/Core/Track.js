const internal = Symbol('internal');
/**
 * Track changes to the object's properties.
 * @param object
 * @param keys
 * @param callback
 */
export function track(object, keys, callback) {
    for (const key of keys) {
        object[internal] = object[internal] ?? {};
        object[internal][key] = object[key];
        Object.defineProperty(object, key, {
            get() {
                return object[internal][key];
            },
            set(value) {
                object[internal][key] = value;
                callback(key, value, object);
            },
            configurable: true,
            enumerable: true,
        });
    }
}
