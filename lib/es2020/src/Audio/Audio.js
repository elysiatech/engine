var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Audio_eventDispatcher, _Audio_paused, _Audio_stopped, _Audio_playing, _Audio_muted, _Audio_position, _Audio_eventQueue, _Audio_gainNode, _Audio_userNodes, _Audio_volume, _Audio_player, _Audio_buffer, _Audio_audioBuffer, _Audio_source, _Audio_loop, _Audio_startedAt, _Audio_duration, _Audio_ready, _Audio_error;
import { AudioPlayer } from "./AudioPlayer.js";
import { Queue } from "../Containers/Queue.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import * as Events from "./AudioEvents.js";
import { ASSERT } from "../Core/Asserts.js";
import { isBrowser } from "../Core/Asserts.js";
export class Audio {
    get loading() { return !__classPrivateFieldGet(this, _Audio_ready, "f"); }
    get ready() { return __classPrivateFieldGet(this, _Audio_ready, "f"); }
    get error() { return __classPrivateFieldGet(this, _Audio_error, "f"); }
    get playing() { return __classPrivateFieldGet(this, _Audio_playing, "f"); }
    set playing(value) { value ? this.play() : this.pause(); }
    get paused() { return __classPrivateFieldGet(this, _Audio_paused, "f"); }
    set paused(value) { value ? this.pause() : this.play(); }
    get stopped() { return __classPrivateFieldGet(this, _Audio_stopped, "f"); }
    set stopped(value) { value ? this.stop() : this.play(); }
    get muted() { return __classPrivateFieldGet(this, _Audio_muted, "f"); }
    set muted(value) { value ? this.mute() : this.unmute(); }
    get loop() { return __classPrivateFieldGet(this, _Audio_loop, "f"); }
    set loop(value) {
        if (!isBrowser())
            return;
        if (!__classPrivateFieldGet(this, _Audio_ready, "f")) {
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").enqueue(() => this.loop = value);
            return;
        }
        ASSERT(!!__classPrivateFieldGet(this, _Audio_source, "f"), "Cannot set loop before audio is loaded");
        __classPrivateFieldSet(this, _Audio_loop, value, "f");
        __classPrivateFieldGet(this, _Audio_source, "f").loop = value;
    }
    get volume() { return __classPrivateFieldGet(this, _Audio_volume, "f"); }
    set volume(value) {
        if (!isBrowser())
            return;
        if (!__classPrivateFieldGet(this, _Audio_ready, "f")) {
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").enqueue(() => this.volume = value);
            return;
        }
        __classPrivateFieldSet(this, _Audio_volume, clamp(value, 0, 1), "f");
        __classPrivateFieldGet(this, _Audio_gainNode, "f").gain.value = __classPrivateFieldGet(this, _Audio_volume, "f");
    }
    get position() { return __classPrivateFieldGet(this, _Audio_position, "f"); }
    set position(value) { this.seek(value); }
    get duration() { return __classPrivateFieldGet(this, _Audio_duration, "f"); }
    constructor(args) {
        Object.defineProperty(this, "addEventListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "removeEventListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _Audio_eventDispatcher.set(this, new ElysiaEventDispatcher);
        _Audio_paused.set(this, false);
        _Audio_stopped.set(this, true);
        _Audio_playing.set(this, false);
        _Audio_muted.set(this, false);
        _Audio_position.set(this, 0);
        _Audio_eventQueue.set(this, new Queue);
        _Audio_gainNode.set(this, void 0);
        _Audio_userNodes.set(this, void 0);
        _Audio_volume.set(this, 1);
        _Audio_player.set(this, void 0);
        _Audio_buffer.set(this, void 0);
        _Audio_audioBuffer.set(this, void 0);
        _Audio_source.set(this, void 0);
        _Audio_loop.set(this, void 0);
        _Audio_startedAt.set(this, void 0);
        _Audio_duration.set(this, 0);
        _Audio_ready.set(this, false);
        _Audio_error.set(this, void 0);
        if (!isBrowser()) {
            return;
        }
        __classPrivateFieldSet(this, _Audio_player, args.player, "f");
        __classPrivateFieldSet(this, _Audio_buffer, args.bytes, "f");
        __classPrivateFieldSet(this, _Audio_userNodes, args.nodes || [], "f");
        __classPrivateFieldSet(this, _Audio_loop, args.loop || false, "f");
        __classPrivateFieldSet(this, _Audio_volume, args.volume || 1, "f");
        __classPrivateFieldSet(this, _Audio_gainNode, AudioPlayer.GetContext().createGain(), "f");
        this.addEventListener = __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").addEventListener.bind(__classPrivateFieldGet(this, _Audio_eventDispatcher, "f"));
        this.removeEventListener = __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").removeEventListener.bind(__classPrivateFieldGet(this, _Audio_eventDispatcher, "f"));
        __classPrivateFieldGet(this, _Audio_player, "f").instances.add(new WeakRef(this));
        __classPrivateFieldGet(this, _Audio_player, "f").createAudioBuffer(__classPrivateFieldGet(this, _Audio_buffer, "f")).then((buffer) => {
            if (!buffer) {
                __classPrivateFieldSet(this, _Audio_error, new Error("Failed to create audio buffer"), "f");
                __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").dispatchEvent(new Events.AudioErrorEvent(this));
                return;
            }
            __classPrivateFieldSet(this, _Audio_audioBuffer, buffer, "f");
            __classPrivateFieldSet(this, _Audio_duration, buffer.duration, "f");
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").flush(x => x?.());
        }, (error) => {
            __classPrivateFieldSet(this, _Audio_error, error, "f");
        });
    }
    fire() {
        if (!isBrowser())
            return;
        if (!__classPrivateFieldGet(this, _Audio_ready, "f")) {
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").enqueue(() => this.fire());
            return;
        }
        if (!__classPrivateFieldGet(this, _Audio_audioBuffer, "f"))
            return;
        const src = AudioPlayer.GetContext().createBufferSource();
        src.buffer = __classPrivateFieldGet(this, _Audio_audioBuffer, "f");
        src.connect(__classPrivateFieldGet(this, _Audio_gainNode, "f")).connect(AudioPlayer.GetContext().destination);
        src.start(0);
    }
    play() {
        if (!isBrowser())
            return;
        if (!__classPrivateFieldGet(this, _Audio_ready, "f")) {
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").enqueue(() => this.play());
            return;
        }
        if (!__classPrivateFieldGet(this, _Audio_audioBuffer, "f") || __classPrivateFieldGet(this, _Audio_playing, "f")) {
            return;
        }
        const ctx = AudioPlayer.GetContext();
        __classPrivateFieldSet(this, _Audio_source, ctx.createBufferSource(), "f");
        __classPrivateFieldGet(this, _Audio_source, "f").buffer = __classPrivateFieldGet(this, _Audio_audioBuffer, "f");
        __classPrivateFieldGet(this, _Audio_source, "f").loop = __classPrivateFieldGet(this, _Audio_loop, "f");
        __classPrivateFieldGet(this, _Audio_source, "f").connect(__classPrivateFieldGet(this, _Audio_gainNode, "f"));
        let nextNode = __classPrivateFieldGet(this, _Audio_gainNode, "f");
        for (const node of __classPrivateFieldGet(this, _Audio_userNodes, "f")) {
            nextNode.connect(node);
            nextNode = node;
        }
        nextNode.connect(ctx.destination);
        __classPrivateFieldGet(this, _Audio_source, "f").start(0, __classPrivateFieldGet(this, _Audio_position, "f"));
        __classPrivateFieldSet(this, _Audio_startedAt, ctx.currentTime, "f");
        __classPrivateFieldSet(this, _Audio_playing, true, "f");
        __classPrivateFieldSet(this, _Audio_paused, false, "f");
        __classPrivateFieldSet(this, _Audio_stopped, false, "f");
        __classPrivateFieldGet(this, _Audio_source, "f").addEventListener("ended", this.onAudioEnd);
        __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").dispatchEvent(new Events.AudioPlayEvent(this));
    }
    pause() {
        if (!isBrowser())
            return;
        if (!__classPrivateFieldGet(this, _Audio_ready, "f")) {
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").enqueue(() => this.pause());
            return;
        }
        const ctx = AudioPlayer.GetContext();
        if (__classPrivateFieldGet(this, _Audio_source, "f")) {
            this.destroySource(__classPrivateFieldGet(this, _Audio_source, "f"));
        }
        __classPrivateFieldSet(this, _Audio_playing, false, "f");
        __classPrivateFieldSet(this, _Audio_position, __classPrivateFieldGet(this, _Audio_position, "f") + (ctx.currentTime - (__classPrivateFieldGet(this, _Audio_startedAt, "f") ?? 0)), "f");
        __classPrivateFieldSet(this, _Audio_paused, true, "f");
        __classPrivateFieldSet(this, _Audio_stopped, false, "f");
        __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").dispatchEvent(new Events.AudioPauseEvent(this));
    }
    togglePlay() { __classPrivateFieldGet(this, _Audio_playing, "f") ? this.pause() : this.play(); }
    stop() {
        if (!isBrowser())
            return;
        if (!__classPrivateFieldGet(this, _Audio_ready, "f")) {
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").enqueue(() => this.stop());
            return;
        }
        if (!__classPrivateFieldGet(this, _Audio_source, "f")) {
            return;
        }
        this.destroySource(__classPrivateFieldGet(this, _Audio_source, "f"));
        __classPrivateFieldSet(this, _Audio_playing, false, "f");
        __classPrivateFieldSet(this, _Audio_paused, false, "f");
        __classPrivateFieldSet(this, _Audio_stopped, true, "f");
        __classPrivateFieldSet(this, _Audio_position, 0, "f");
        __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").dispatchEvent(new Events.AudioStopEvent(this));
    }
    mute() {
        if (!isBrowser())
            return;
        if (!__classPrivateFieldGet(this, _Audio_ready, "f")) {
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").enqueue(() => this.mute());
            return;
        }
        __classPrivateFieldGet(this, _Audio_gainNode, "f").gain.value = 0;
        __classPrivateFieldSet(this, _Audio_muted, true, "f");
        __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").dispatchEvent(new Events.AudioMuteEvent(this));
    }
    unmute() {
        if (!isBrowser())
            return;
        if (!__classPrivateFieldGet(this, _Audio_ready, "f")) {
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").enqueue(() => this.unmute());
            return;
        }
        __classPrivateFieldGet(this, _Audio_gainNode, "f").gain.value = __classPrivateFieldGet(this, _Audio_volume, "f");
        __classPrivateFieldSet(this, _Audio_muted, false, "f");
        __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").dispatchEvent(new Events.AudioVolumeEvent(this));
    }
    toggleMute() { __classPrivateFieldGet(this, _Audio_muted, "f") ? this.unmute() : this.mute(); }
    seek(position) {
        if (!isBrowser())
            return;
        if (!__classPrivateFieldGet(this, _Audio_ready, "f")) {
            __classPrivateFieldGet(this, _Audio_eventQueue, "f").enqueue(() => this.seek(position));
            return;
        }
        __classPrivateFieldSet(this, _Audio_position, clamp(position, 0, __classPrivateFieldGet(this, _Audio_duration, "f")), "f");
        __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").dispatchEvent(new Events.AudioSeekEvent(this));
        if (__classPrivateFieldGet(this, _Audio_playing, "f")) {
            ASSERT(!!__classPrivateFieldGet(this, _Audio_source, "f"), "No source to seek");
            this.destroySource(__classPrivateFieldGet(this, _Audio_source, "f"));
            __classPrivateFieldSet(this, _Audio_playing, false, "f");
            this.play();
        }
    }
    clone() {
        if (!__classPrivateFieldGet(this, _Audio_buffer, "f"))
            throw new Error("Cannot clone an audio instance without a buffer");
        return new Audio({
            player: __classPrivateFieldGet(this, _Audio_player, "f"),
            bytes: __classPrivateFieldGet(this, _Audio_buffer, "f"),
            loop: __classPrivateFieldGet(this, _Audio_loop, "f"),
            volume: __classPrivateFieldGet(this, _Audio_volume, "f"),
            nodes: __classPrivateFieldGet(this, _Audio_userNodes, "f"),
        });
    }
    onAudioEnd() {
        __classPrivateFieldSet(this, _Audio_paused, false, "f");
        __classPrivateFieldSet(this, _Audio_stopped, true, "f");
        __classPrivateFieldSet(this, _Audio_playing, false, "f");
        __classPrivateFieldSet(this, _Audio_position, 0, "f");
        __classPrivateFieldGet(this, _Audio_eventDispatcher, "f").dispatchEvent(new Events.AudioStopEvent(this));
    }
    ;
    destroySource(source) {
        source.disconnect();
        source.stop();
        source.removeEventListener("ended", this.onAudioEnd);
    }
}
_Audio_eventDispatcher = new WeakMap(), _Audio_paused = new WeakMap(), _Audio_stopped = new WeakMap(), _Audio_playing = new WeakMap(), _Audio_muted = new WeakMap(), _Audio_position = new WeakMap(), _Audio_eventQueue = new WeakMap(), _Audio_gainNode = new WeakMap(), _Audio_userNodes = new WeakMap(), _Audio_volume = new WeakMap(), _Audio_player = new WeakMap(), _Audio_buffer = new WeakMap(), _Audio_audioBuffer = new WeakMap(), _Audio_source = new WeakMap(), _Audio_loop = new WeakMap(), _Audio_startedAt = new WeakMap(), _Audio_duration = new WeakMap(), _Audio_ready = new WeakMap(), _Audio_error = new WeakMap();
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
