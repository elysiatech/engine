import { Asset } from './Asset';
export declare class TextAsset extends Asset<string> {
    private url;
    constructor(url: string);
    loader(): Promise<any>;
}
