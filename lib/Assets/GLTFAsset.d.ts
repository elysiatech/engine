import { Asset } from './Asset';
import { GLTF } from "three-stdlib";
type GLTFAssetType = {
    gltf: GLTF;
    clone: () => GLTF["scene"];
};
export declare class GLTFAsset extends Asset<GLTFAssetType> {
    private url;
    static GLTFLoader: any;
    constructor(url: string);
    loader(): Promise<GLTFAssetType>;
}
export {};
