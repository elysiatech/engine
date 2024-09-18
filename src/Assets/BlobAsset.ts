import { Asset } from './Asset';

export class BlobAsset extends Asset<Blob>
{
	constructor(private url: string) { super(); }

	async loader(): Promise<Blob>
	{
		const response = await this.fetch(this.url);
		if (!response.ok) throw new Error(`Failed to load blob: ${response.statusText}`);
		return await response.blob();
	}
}