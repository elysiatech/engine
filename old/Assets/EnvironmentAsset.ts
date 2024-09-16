import { Asset } from "./Asset";
import { EXRLoader, RGBELoader } from "three-stdlib";
import * as Three from "three";

export class EnvironmentAsset extends Asset<Three.Texture | Three.CubeTexture> {
	constructor(public readonly path: string | string[]) {
		super();
	}

	static EXRLoader = new EXRLoader();
	static RGBELoader = new RGBELoader();
	static CubeTextureLoader = new Three.CubeTextureLoader();

	async loader(): Promise<Three.Texture | Three.CubeTexture> {
		const firstEntry = Array.isArray(this.path) ? this.path[0] : this.path;

		const extension: string | false | undefined = Array.isArray(this.path)
			? "cube"
			: firstEntry.startsWith("data:application/exr")
				? "exr"
				: firstEntry.startsWith("data:application/hdr")
					? "hdr"
					: firstEntry.split(".").pop()?.split("?")?.shift()?.toLowerCase();

		switch (extension) {
			case "hdr":
			case "exr": {
				const loader =
					extension === "exr"
						? EnvironmentAsset.EXRLoader
						: EnvironmentAsset.RGBELoader;
				const texture = await loader.loadAsync(firstEntry, (e) =>
					this.updateProgress(e.loaded / e.total),
				);
				texture.mapping = Three.EquirectangularReflectionMapping;
				return texture;
			}
			case "cube": {
				const loaderCube = EnvironmentAsset.CubeTextureLoader;
				const texture = await loaderCube.loadAsync(this.path as string[], (e) =>
					this.updateProgress(e.loaded / e.total),
				);
				texture.mapping = Three.CubeReflectionMapping;
				return texture;
			}
			default:
				throw new Error(`Unsupported environment file extension ${extension}`);
		}
	}
}