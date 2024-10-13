import { Asset } from './Asset';
export declare class ImageAsset extends Asset<HTMLImageElement> {
    private url;
    constructor(url: string);
    loader(): Promise<HTMLImageElement>;
}
