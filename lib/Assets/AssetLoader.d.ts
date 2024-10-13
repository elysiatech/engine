import { Asset } from "./Asset";
import { Constructor } from "../Core/Utilities";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
export declare class AssetLoader<A extends Record<string, Asset<any>>> {
    #private;
    get loading(): boolean;
    get loaded(): boolean;
    get error(): Error | null;
    get progress(): number;
    constructor(assets: A);
    load(): Promise<void> | undefined;
    unwrap<T extends keyof A>(type: T): NonNullable<A[T]["data"]>;
    unwrap<T extends Constructor<Asset<any>>>(type: T, key: string): NonNullable<InstanceType<T>["data"]>;
    get<T extends keyof A>(a: T): A[T];
    get<T extends Asset<any>>(a: string): T | undefined;
    addEventListener: ElysiaEventDispatcher["addEventListener"];
    removeEventListener: ElysiaEventDispatcher["removeEventListener"];
}
