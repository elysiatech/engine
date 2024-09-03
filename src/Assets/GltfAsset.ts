import { Asset } from "./Asset";
import { GLTF, GLTFLoader } from "three-stdlib";
import * as Three from "three";

export class GltfAsset extends Asset<{ gltf: GLTF, scene: Three.Group, clone: () => Three.Group }> {
	constructor(public readonly path: string) {
		super();
	}

	async loader() {
		const loader = new GLTFLoader();
		const gltf = await loader.loadAsync(this.path, (e) =>
			this.updateProgress(e.loaded / e.total),
		);
		return {
			gltf,
			scene: gltf.scene,
			clone: () => gltf.scene.clone(true),
		}
	}
}