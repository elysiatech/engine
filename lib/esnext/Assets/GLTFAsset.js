import { Asset } from "./Asset.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export class GLTFAsset extends Asset {
    url;
    static GLTFLoader = new GLTFLoader();
    constructor(url) {
        super();
        this.url = url;
    }
    async loader() {
        return new Promise((resolve, reject) => {
            GLTFAsset.GLTFLoader.load(this.url, (gltf) => resolve(({ gltf: gltf, clone: () => gltf.scene.clone(true) })), (p) => this.updateProgress(p.loaded / p.total), reject);
        });
    }
}
