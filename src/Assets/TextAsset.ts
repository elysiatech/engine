import { Asset } from './Asset';

export class TextAsset extends Asset<string>
{
	constructor(private url: string) { super(); }
	async loader()
	{
		const res = await this.fetch(this.url);
		if(!res.ok) throw new Error(`Failed to load Text asset: ${this.url}`);
		return res.text();
	}
}