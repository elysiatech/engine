import * as Three from 'three';
import { Asset } from './Asset';
export declare class TextureAsset extends Asset<Three.Texture> {
    private url;
    static TextureLoader: Three.TextureLoader;
    constructor(url: string);
    loader(): Promise<Three.Texture>;
}
