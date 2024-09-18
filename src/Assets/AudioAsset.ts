import { Asset } from "./Asset";
import { Audio, type AudioConstructorArguments } from "../Audio/Audio";

export class AudioAsset extends Asset<Audio>
{
	constructor(private args: Omit<AudioConstructorArguments, "bytes"> & { url: string }) { super(); }
	async loader()
	{
		const r = await this.fetch(this.args.url);
		const b = await r.arrayBuffer();
		return new Audio({ ...this.args, bytes: b });
	}
}