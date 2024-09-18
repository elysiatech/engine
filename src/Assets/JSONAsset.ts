import { Asset } from './Asset';
import { Serializable } from "../Core/Utilities";

export class JSONAsset extends Asset<Serializable>
{
	constructor(private url: string) { super(); }
	async loader() {
		const res = await this.fetch(this.url);
		if(!res.ok) throw new Error(`Failed to load JSON asset: ${this.url}`);
		return res.json();
	}
}