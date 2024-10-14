import * as Three from 'three';
import { Asset } from './Asset.ts';

export class TextureAsset extends Asset<Three.Texture>
{
	static TextureLoader = new Three.TextureLoader();
	constructor(private url: string) { super(); }
	async loader()
	{
		return new Promise<Three.Texture>((resolve, reject) =>
		{
			TextureAsset.TextureLoader.load(
				this.url,
				resolve,
				(p) => this.updateProgress(p.loaded / p.total),
				reject
			);
		});
	}
}