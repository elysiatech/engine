import { Asset } from "./Asset.ts";
import * as Three from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
export declare class RGBEAsset extends Asset<Three.DataTexture> {
    url: string;
    constructor(url: string);
    static Loader: RGBELoader;
    loader(): Promise<Three.DataTexture>;
}
