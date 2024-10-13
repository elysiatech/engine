import { Asset } from "./Asset";
export declare class ArrayBufferAsset extends Asset<ArrayBuffer> {
    private url;
    constructor(url: string);
    loader(): Promise<any>;
}
