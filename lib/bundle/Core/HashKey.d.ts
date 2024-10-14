/**
 * Hashes a key to a string, throwing an error if the key contains unserializable values.
 */
export declare function hashKey(key: any): string;
/**
 * Hashes a key to a string, or returns the key if it cannot be hashed.
 */
export declare function safeHashKey(k: any): any;
