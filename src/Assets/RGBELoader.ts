import { Asset } from "./Asset.ts"
import * as Three from "three"
import { RGBELoader } from "three/examples/jsm/Addons.js";

export class RGBEAsset extends Asset<Three.DataTexture>
{
	constructor(public url: string)
	{
		super()
	}

	static Loader = new RGBELoader;

	override async loader()
	{
		return new Promise<Three.DataTexture>((resolve) =>
			RGBEAsset.Loader.load(
				this.url,
				(texture) => resolve(texture),
				(p) => {this.updateProgress(p.loaded / p.total)}
			),
		)
	}
}
