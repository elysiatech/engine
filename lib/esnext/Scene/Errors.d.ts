export declare class LifeCycleError extends Error {
    constructor(method: string, target: any, cause: any);
}
export declare const reportLifecycleError: <T extends any[]>(context: any, method: (...args: T) => any, ...args: T) => any;
