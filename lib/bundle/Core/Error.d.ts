export declare class LifeCycleError extends Error {
    constructor(method: string, target: any, cause: any);
}
export declare function reportLifecycleError(value: any, { kind, name }: {
    kind: any;
    name: any;
}): any;
