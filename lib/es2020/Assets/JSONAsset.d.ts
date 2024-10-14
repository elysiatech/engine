import { Asset } from './Asset.ts';
import { Serializable } from "../Core/Utilities.ts";
export declare class JSONAsset extends Asset<Serializable> {
    private url;
    constructor(url: string);
    loader(): Promise<any>;
}
