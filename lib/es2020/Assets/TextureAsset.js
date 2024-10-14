import * as Three from 'three';
import { Asset } from "./Asset.js";
export class TextureAsset extends Asset {
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
        return new Promise((resolve, reject) => {
            TextureAsset.TextureLoader.load(this.url, resolve, (p) => this.updateProgress(p.loaded / p.total), reject);
        });
    }
}
Object.defineProperty(TextureAsset, "TextureLoader", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Three.TextureLoader()
});
