import { Asset } from "./Asset.js";
export class ArrayBufferAsset extends Asset {
    url;
    constructor(url) {
        super();
        this.url = url;
    }
    async loader() {
        const r = await this.fetch(this.url);
        if (!r.ok)
            throw new Error(`Failed to load array buffer: ${r.statusText}`);
        return await r.arrayBuffer();
    }
}
