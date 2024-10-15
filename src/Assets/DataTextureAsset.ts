import { Asset } from "./Asset.ts"
import * as Three from "three"

export class DataTextureAsset extends Asset<Three.DataTexture>
{
	constructor(public url: string)
	{
		super()
	}

	static Loader = new Three.DataTextureLoader;

	override async loader()
	{
		return new Promise<Three.DataTexture>((resolve) =>
			DataTextureAsset.Loader.load(
				this.url,
				(texture) => resolve(texture),
				(p) => {this.updateProgress(p.loaded / p.total)}
			),
		)
	}
}
