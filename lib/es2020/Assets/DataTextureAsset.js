import { Asset } from "./Asset.js";
import * as Three from "three";
export class DataTextureAsset extends Asset {
    constructor(url) {
        super();
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: url
        });
    }
    async loader() {
        return new Promise((resolve) => DataTextureAsset.Loader.load(this.url, (texture) => resolve(texture), (p) => { this.updateProgress(p.loaded / p.total); }));
    }
}
Object.defineProperty(DataTextureAsset, "Loader", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Three.DataTextureLoader
});
