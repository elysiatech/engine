import { Asset } from "./Asset.js";
export class ArrayBufferAsset extends Asset {
    constructor(url) {
        super();
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: url
        });
    }
    async loader() {
        const r = await this.fetch(this.url);
        if (!r.ok)
            throw new Error(`Failed to load array buffer: ${r.statusText}`);
        return await r.arrayBuffer();
    }
}
