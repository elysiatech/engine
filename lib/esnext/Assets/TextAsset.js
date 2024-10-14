import { Asset } from "./Asset.js";
export class TextAsset extends Asset {
    url;
    constructor(url) {
        super();
        this.url = url;
    }
    async loader() {
        const res = await this.fetch(this.url);
        if (!res.ok)
            throw new Error(`Failed to load Text asset: ${this.url}`);
        return res.text();
    }
}
