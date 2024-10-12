import { AssetLoader } from "../../src/Assets/AssetLoader.ts";
import { GLTFAsset } from "../../src/Assets/GLTFAsset.ts";

export const Assets = new AssetLoader({
	Magnum: new GLTFAsset("/assets/Magnum.glb"),
});