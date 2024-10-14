import { Asset } from './Asset.ts';
export declare class TextAsset extends Asset<string> {
    private url;
    constructor(url: string);
    loader(): Promise<string>;
}
