export declare function toBoolean(val: any): boolean;
export declare function toError(err: unknown): Error;
export declare function noop(): void;
export type Constructor<T> = new (...args: any[]) => T;
export type Maybe<T> = T | null | undefined;
export type MaybePromise<T> = T | Promise<T>;
export type Serializable = string | number | boolean | null | undefined | Serializable[] | {
    [key: string]: Serializable;
};
export declare function tick<T>(callback?: T): T extends Function ? void : Promise<void>;
type BoundDecorator = (value: Function, context: any) => void | ((...args: any) => any);
/**
 * Binds a method to the instance of the class it is defined in.
 */
export declare const bound: BoundDecorator;
export {};
