import { Asset } from "./Asset.ts";
import * as Three from "three";
export declare class DataTextureAsset extends Asset<Three.DataTexture> {
    url: string;
    constructor(url: string);
    static Loader: Three.DataTextureLoader;
    loader(): Promise<Three.DataTexture>;
}
