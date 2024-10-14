import { Asset } from './Asset.ts';
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type GLTFAssetType = {
	gltf: GLTF,
	clone: () => GLTF["scene"]
}

export class GLTFAsset extends Asset<GLTFAssetType>
{
	static GLTFLoader = new GLTFLoader();
	constructor(private url: string) { super(); }
	async loader()
	{
		return new Promise<GLTFAssetType>((resolve, reject) =>
		{
			GLTFAsset.GLTFLoader.load(
				this.url,
				(gltf) => resolve(({ gltf: gltf, clone: () => gltf.scene.clone(true) })),
				(p) => this.updateProgress(p.loaded / p.total),
				reject
			);
		});
	}
}