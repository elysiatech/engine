/**
 * Track changes to the object's properties.
 * @param object
 * @param keys
 * @param callback
 */
export declare function track(object: Record<any, any>, keys: string[], callback: (key: string, value: any, object: Record<string, any>) => void): void;
