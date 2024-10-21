import { Asset } from "./Asset.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export class GLTFAsset extends Asset {
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
            GLTFAsset.GLTFLoader.load(this.url, (gltf) => resolve(({ gltf: gltf, clone: () => gltf.scene.clone(true) })), (p) => this.updateProgress(p.loaded / p.total), reject);
        });
    }
}
Object.defineProperty(GLTFAsset, "GLTFLoader", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new GLTFLoader()
});
