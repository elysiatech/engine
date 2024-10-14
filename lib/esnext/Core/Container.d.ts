type Throws<T> = T;
/****************************************************************************************
 * Injection Keys
 *****************************************************************************************/
export declare class InjectionKey<T> {
    brand: T;
    constructor(brand?: T);
}
type Constructor<T> = (new (...args: any[]) => T);
type AbstractConstructor<T> = abstract new (...args: any[]) => T;
type Key<T> = InjectionKey<T> | Constructor<T> | AbstractConstructor<T> | string | symbol;
/****************************************************************************************
 * Container
 *****************************************************************************************/
export declare class OutOfScopeError extends Error {
}
export declare class ResolutionError extends Error {
}
export declare class Container {
    #private;
    static current: Container | undefined;
    instances: Map<Key<any>, Constructor<any>>;
    singletons: Map<Key<any>, {
        instance: any;
        resolved: boolean;
    }>;
    values: Map<Key<any>, any>;
    registerTransient<K extends Key<any> | Constructor<any>, T extends Constructor<any>>(key: K | T, value?: T): void;
    registerSingleton<K extends Key<any>, T extends Constructor<any>>(key: K | T, value?: T): void;
    registerValue<T>(key: Key<T>, value: T): void;
    resolve<T>(key: Key<T>): T;
    resolveSafe<T>(key: Key<T>): T | undefined;
}
export type Injected<T extends InjectionKey<T>> = T['brand'];
export declare function inject<T>(key: Key<T>): Throws<T>;
export declare function injectSafe<T>(key: Key<T>): T | undefined;
export {};
