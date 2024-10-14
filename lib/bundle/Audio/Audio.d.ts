import { AudioPlayer } from "./AudioPlayer.ts";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.ts";
export interface AudioConstructorArguments {
    bytes: ArrayBuffer;
    player: AudioPlayer;
    loop?: boolean;
    volume?: number;
    nodes?: AudioNode[];
}
export declare class Audio {
    #private;
    get loading(): boolean;
    get ready(): boolean;
    get error(): Error | undefined;
    get playing(): boolean;
    set playing(value: boolean);
    get paused(): boolean;
    set paused(value: boolean);
    get stopped(): boolean;
    set stopped(value: boolean);
    get muted(): boolean;
    set muted(value: boolean);
    get loop(): boolean;
    set loop(value: boolean);
    get volume(): number;
    set volume(value: number);
    get position(): number;
    set position(value: number);
    get duration(): number;
    constructor(args: AudioConstructorArguments);
    fire(): void;
    play(): void;
    pause(): void;
    togglePlay(): void;
    stop(): void;
    mute(): void;
    unmute(): void;
    toggleMute(): void;
    seek(position: number): void;
    clone(): Audio;
    addEventListener: ElysiaEventDispatcher["addEventListener"];
    removeEventListener: ElysiaEventDispatcher["removeEventListener"];
    private onAudioEnd;
    private destroySource;
}
