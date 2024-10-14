import { AudioPlayer } from "./AudioPlayer.js";
import { Queue } from "../Containers/Queue.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import * as Events from "./AudioEvents.js";
import { ASSERT } from "../Core/Asserts.js";
import { isBrowser } from "../Core/Asserts.js";
export class Audio {
    get loading() { return !this.#ready; }
    get ready() { return this.#ready; }
    get error() { return this.#error; }
    get playing() { return this.#playing; }
    set playing(value) { value ? this.play() : this.pause(); }
    get paused() { return this.#paused; }
    set paused(value) { value ? this.pause() : this.play(); }
    get stopped() { return this.#stopped; }
    set stopped(value) { value ? this.stop() : this.play(); }
    get muted() { return this.#muted; }
    set muted(value) { value ? this.mute() : this.unmute(); }
    get loop() { return this.#loop; }
    set loop(value) {
        if (!isBrowser())
            return;
        if (!this.#ready) {
            this.#eventQueue.enqueue(() => this.loop = value);
            return;
        }
        ASSERT(!!this.#source, "Cannot set loop before audio is loaded");
        this.#loop = value;
        this.#source.loop = value;
    }
    get volume() { return this.#volume; }
    set volume(value) {
        if (!isBrowser())
            return;
        if (!this.#ready) {
            this.#eventQueue.enqueue(() => this.volume = value);
            return;
        }
        this.#volume = clamp(value, 0, 1);
        this.#gainNode.gain.value = this.#volume;
    }
    get position() { return this.#position; }
    set position(value) { this.seek(value); }
    get duration() { return this.#duration; }
    constructor(args) {
        if (!isBrowser()) {
            return;
        }
        this.#player = args.player;
        this.#buffer = args.bytes;
        this.#userNodes = args.nodes || [];
        this.#loop = args.loop || false;
        this.#volume = args.volume || 1;
        this.#gainNode = AudioPlayer.GetContext().createGain();
        this.addEventListener = this.#eventDispatcher.addEventListener.bind(this.#eventDispatcher);
        this.removeEventListener = this.#eventDispatcher.removeEventListener.bind(this.#eventDispatcher);
        this.#player.instances.add(new WeakRef(this));
        this.#player.createAudioBuffer(this.#buffer).then((buffer) => {
            if (!buffer) {
                this.#error = new Error("Failed to create audio buffer");
                this.#eventDispatcher.dispatchEvent(new Events.AudioErrorEvent(this));
                return;
            }
            this.#audioBuffer = buffer;
            this.#duration = buffer.duration;
            this.#eventQueue.flush(x => x?.());
        }, (error) => {
            this.#error = error;
        });
    }
    fire() {
        if (!isBrowser())
            return;
        if (!this.#ready) {
            this.#eventQueue.enqueue(() => this.fire());
            return;
        }
        if (!this.#audioBuffer)
            return;
        const src = AudioPlayer.GetContext().createBufferSource();
        src.buffer = this.#audioBuffer;
        src.connect(this.#gainNode).connect(AudioPlayer.GetContext().destination);
        src.start(0);
    }
    play() {
        if (!isBrowser())
            return;
        if (!this.#ready) {
            this.#eventQueue.enqueue(() => this.play());
            return;
        }
        if (!this.#audioBuffer || this.#playing) {
            return;
        }
        const ctx = AudioPlayer.GetContext();
        this.#source = ctx.createBufferSource();
        this.#source.buffer = this.#audioBuffer;
        this.#source.loop = this.#loop;
        this.#source.connect(this.#gainNode);
        let nextNode = this.#gainNode;
        for (const node of this.#userNodes) {
            nextNode.connect(node);
            nextNode = node;
        }
        nextNode.connect(ctx.destination);
        this.#source.start(0, this.#position);
        this.#startedAt = ctx.currentTime;
        this.#playing = true;
        this.#paused = false;
        this.#stopped = false;
        this.#source.addEventListener("ended", this.onAudioEnd);
        this.#eventDispatcher.dispatchEvent(new Events.AudioPlayEvent(this));
    }
    pause() {
        if (!isBrowser())
            return;
        if (!this.#ready) {
            this.#eventQueue.enqueue(() => this.pause());
            return;
        }
        const ctx = AudioPlayer.GetContext();
        if (this.#source) {
            this.destroySource(this.#source);
        }
        this.#playing = false;
        this.#position += ctx.currentTime - (this.#startedAt ?? 0);
        this.#paused = true;
        this.#stopped = false;
        this.#eventDispatcher.dispatchEvent(new Events.AudioPauseEvent(this));
    }
    togglePlay() { this.#playing ? this.pause() : this.play(); }
    stop() {
        if (!isBrowser())
            return;
        if (!this.#ready) {
            this.#eventQueue.enqueue(() => this.stop());
            return;
        }
        if (!this.#source) {
            return;
        }
        this.destroySource(this.#source);
        this.#playing = false;
        this.#paused = false;
        this.#stopped = true;
        this.#position = 0;
        this.#eventDispatcher.dispatchEvent(new Events.AudioStopEvent(this));
    }
    mute() {
        if (!isBrowser())
            return;
        if (!this.#ready) {
            this.#eventQueue.enqueue(() => this.mute());
            return;
        }
        this.#gainNode.gain.value = 0;
        this.#muted = true;
        this.#eventDispatcher.dispatchEvent(new Events.AudioMuteEvent(this));
    }
    unmute() {
        if (!isBrowser())
            return;
        if (!this.#ready) {
            this.#eventQueue.enqueue(() => this.unmute());
            return;
        }
        this.#gainNode.gain.value = this.#volume;
        this.#muted = false;
        this.#eventDispatcher.dispatchEvent(new Events.AudioVolumeEvent(this));
    }
    toggleMute() { this.#muted ? this.unmute() : this.mute(); }
    seek(position) {
        if (!isBrowser())
            return;
        if (!this.#ready) {
            this.#eventQueue.enqueue(() => this.seek(position));
            return;
        }
        this.#position = clamp(position, 0, this.#duration);
        this.#eventDispatcher.dispatchEvent(new Events.AudioSeekEvent(this));
        if (this.#playing) {
            ASSERT(!!this.#source, "No source to seek");
            this.destroySource(this.#source);
            this.#playing = false;
            this.play();
        }
    }
    clone() {
        if (!this.#buffer)
            throw new Error("Cannot clone an audio instance without a buffer");
        return new Audio({
            player: this.#player,
            bytes: this.#buffer,
            loop: this.#loop,
            volume: this.#volume,
            nodes: this.#userNodes,
        });
    }
    addEventListener;
    removeEventListener;
    onAudioEnd() {
        this.#paused = false;
        this.#stopped = true;
        this.#playing = false;
        this.#position = 0;
        this.#eventDispatcher.dispatchEvent(new Events.AudioStopEvent(this));
    }
    ;
    destroySource(source) {
        source.disconnect();
        source.stop();
        source.removeEventListener("ended", this.onAudioEnd);
    }
    #eventDispatcher = new ElysiaEventDispatcher;
    #paused = false;
    #stopped = true;
    #playing = false;
    #muted = false;
    #position = 0;
    #eventQueue = new Queue;
    #gainNode;
    #userNodes;
    #volume = 1;
    #player;
    #buffer;
    #audioBuffer;
    #source;
    #loop;
    #startedAt;
    #duration = 0;
    #ready = false;
    #error;
}
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
