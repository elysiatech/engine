import { Asset } from "./Asset";
import * as Three from "three";
export class TextureAsset extends Asset {
    path;
    constructor(path) {
        super();
        this.path = path;
    }
    async loader() {
        const loader = new Three.TextureLoader();
        return await loader.loadAsync(this.path, (e) => this.updateProgress(e.loaded / e.total));
    }
}
