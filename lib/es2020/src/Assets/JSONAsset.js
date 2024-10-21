import { Asset } from "./Asset.js";
export class JSONAsset extends Asset {
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
        const res = await this.fetch(this.url);
        if (!res.ok)
            throw new Error(`Failed to load JSON asset: ${this.url}`);
        return res.json();
    }
}
