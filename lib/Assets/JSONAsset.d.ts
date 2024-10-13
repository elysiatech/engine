import { Asset } from './Asset';
import { Serializable } from "../Core/Utilities";
export declare class JSONAsset extends Asset<Serializable> {
    private url;
    constructor(url: string);
    loader(): Promise<any>;
}
