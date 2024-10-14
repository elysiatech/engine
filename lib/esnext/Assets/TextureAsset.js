import * as Three from 'three';
import { Asset } from "./Asset.js";
export class TextureAsset extends Asset {
    url;
    static TextureLoader = new Three.TextureLoader();
    constructor(url) {
        super();
        this.url = url;
    }
    async loader() {
        return new Promise((resolve, reject) => {
            TextureAsset.TextureLoader.load(this.url, resolve, (p) => this.updateProgress(p.loaded / p.total), reject);
        });
    }
}
