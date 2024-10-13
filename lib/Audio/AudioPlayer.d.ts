import { Audio, AudioConstructorArguments } from "./Audio";
declare global {
    var ELYSIA_AUDIO_CTX: AudioContext;
}
export declare class AudioPlayer {
    #private;
    static GetContext(): AudioContext;
    readonly instances: Set<WeakRef<Audio>>;
    readonly cache: Map<string | ArrayBuffer, Promise<AudioBuffer>>;
    debug: boolean;
    get muteOnBlur(): boolean;
    set muteOnBlur(value: boolean);
    createAudio(args: AudioConstructorArguments): Audio;
    muteAll(): void;
    unmuteAll(): void;
    pauseAll(): void;
    stopAll(): void;
    createAudioBuffer(input: ArrayBuffer): Promise<AudioBuffer | undefined>;
    constructor();
}
