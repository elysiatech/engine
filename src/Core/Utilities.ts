export function toBoolean(val: any) { return val ? val !== "false" : false; }

export type Constructor<T> = new (...args: any[]) => T