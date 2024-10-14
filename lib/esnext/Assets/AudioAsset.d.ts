import { Asset } from "./Asset.ts";
import { Audio, type AudioConstructorArguments } from "../Audio/Audio.ts";
export declare class AudioAsset extends Asset<Audio> {
    private args;
    constructor(args: Omit<AudioConstructorArguments, "bytes"> & {
        url: string;
    });
    loader(): Promise<Audio>;
}
