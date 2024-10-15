import { Asset } from "./Asset.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";
export class RGBEAsset extends Asset {
    url;
    constructor(url) {
        super();
        this.url = url;
    }
    static Loader = new RGBELoader;
    async loader() {
        return new Promise((resolve) => RGBEAsset.Loader.load(this.url, (texture) => resolve(texture), (p) => { this.updateProgress(p.loaded / p.total); }));
    }
}
