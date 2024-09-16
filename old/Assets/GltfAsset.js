import { Asset } from "./Asset";
import { GLTFLoader } from "three-stdlib";
export class GltfAsset extends Asset {
    path;
    constructor(path) {
        super();
        this.path = path;
    }
    async loader() {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(this.path, (e) => this.updateProgress(e.loaded / e.total));
        return {
            gltf,
            scene: gltf.scene,
            clone: () => gltf.scene.clone(true),
        };
    }
}
