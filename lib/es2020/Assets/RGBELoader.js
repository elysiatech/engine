import { Asset } from "./Asset.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";
export class RGBEAsset extends Asset {
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
        return new Promise((resolve) => RGBEAsset.Loader.load(this.url, (texture) => resolve(texture), (p) => { this.updateProgress(p.loaded / p.total); }));
    }
}
Object.defineProperty(RGBEAsset, "Loader", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new RGBELoader
});
