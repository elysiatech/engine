import { Asset } from './Asset.ts';
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
type GLTFAssetType = {
    gltf: GLTF;
    clone: () => GLTF["scene"];
};
export declare class GLTFAsset extends Asset<GLTFAssetType> {
    private url;
    static GLTFLoader: GLTFLoader;
    constructor(url: string);
    loader(): Promise<GLTFAssetType>;
}
export {};
