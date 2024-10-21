import { Asset } from "./Asset.js";
import * as Three from "three";
export class DataTextureAsset extends Asset {
    url;
    constructor(url) {
        super();
        this.url = url;
    }
    static Loader = new Three.DataTextureLoader;
    async loader() {
        return new Promise((resolve) => DataTextureAsset.Loader.load(this.url, (texture) => resolve(texture), (p) => { this.updateProgress(p.loaded / p.total); }));
    }
}
