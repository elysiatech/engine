import { Asset } from "./Asset";
import * as Three from "three";

export class TextureAsset extends Asset<Three.Texture> {
	constructor(public readonly path: string) {
		super();
	}

	async loader() {
		const loader = new Three.TextureLoader();
		return await loader.loadAsync(this.path, (e) =>
			this.updateProgress(e.loaded / e.total),
		);
	}
}