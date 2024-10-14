import { Asset } from "./Asset.js";
import { Audio } from "../Audio/Audio.js";
export class AudioAsset extends Asset {
    constructor(args) {
        super();
        Object.defineProperty(this, "args", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: args
        });
    }
    async loader() {
        const r = await this.fetch(this.args.url);
        const b = await r.arrayBuffer();
        return new Audio({ ...this.args, bytes: b });
    }
}
