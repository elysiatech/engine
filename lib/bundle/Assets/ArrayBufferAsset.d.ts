import { Asset } from "./Asset.ts";
export declare class ArrayBufferAsset extends Asset<ArrayBuffer> {
    private url;
    constructor(url: string);
    loader(): Promise<ArrayBuffer>;
}
