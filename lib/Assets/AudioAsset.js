import { Asset } from "./Asset";
import { Audio } from "../Audio/Audio";
export class AudioAsset extends Asset {
    args;
    constructor(args) {
        super();
        this.args = args;
    }
    async loader() {
        const r = await this.fetch(this.args.url);
        const b = await r.arrayBuffer();
        return new Audio({ ...this.args, bytes: b });
    }
}
