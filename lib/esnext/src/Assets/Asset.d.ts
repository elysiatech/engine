import { ElysiaEventDispatcher } from "../Events/EventDispatcher.ts";
import { Maybe, MaybePromise } from "../Core/Utilities.ts";
export declare abstract class Asset<T> {
    #private;
    abstract loader(): MaybePromise<Maybe<T>>;
    get data(): Maybe<T>;
    get error(): Maybe<Error>;
    get loaded(): boolean;
    get loading(): boolean;
    get progress(): number;
    constructor();
    load(): Promise<Maybe<T>>;
    private loadImpl;
    addEventListener: ElysiaEventDispatcher["addEventListener"];
    removeEventListener: ElysiaEventDispatcher["removeEventListener"];
    protected fetch(url: string, options?: RequestInit & {
        onProgress?: (progress: number) => void;
    }): Promise<Response>;
    protected updateProgress(progress: number): void;
}
