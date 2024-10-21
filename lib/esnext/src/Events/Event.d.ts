export declare class ElysiaEvent<T extends unknown> {
    readonly value: T;
    timestamp: number;
    constructor(value: T);
}
export declare class BeginLoadEvent extends ElysiaEvent<void> {
}
export declare class ProgressEvent extends ElysiaEvent<number> {
}
export declare class ErrorEvent extends ElysiaEvent<Error> {
}
export declare class LoadedEvent extends ElysiaEvent<void> {
}
