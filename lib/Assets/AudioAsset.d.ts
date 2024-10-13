import { Asset } from "./Asset";
import { Audio, type AudioConstructorArguments } from "../Audio/Audio";
export declare class AudioAsset extends Asset<Audio> {
    private args;
    constructor(args: Omit<AudioConstructorArguments, "bytes"> & {
        url: string;
    });
    loader(): Promise<any>;
}
