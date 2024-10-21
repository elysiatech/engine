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
var _AudioPlayer_muteOnBlur;
import { ASSERT, isBrowser } from "../Core/Asserts.js";
import { Audio } from "./Audio.js";
export class AudioPlayer {
    static GetContext() {
        return window.ELYSIA_AUDIO_CTX;
    }
    get muteOnBlur() {
        return __classPrivateFieldGet(this, _AudioPlayer_muteOnBlur, "f");
    }
    set muteOnBlur(value) {
        __classPrivateFieldSet(this, _AudioPlayer_muteOnBlur, value, "f");
        if (!isBrowser())
            return;
        if (value) {
            window.addEventListener("blur", this.muteAll);
            window.addEventListener("focus", this.unmuteAll);
        }
        else {
            window.removeEventListener("blur", this.muteAll);
            window.removeEventListener("focus", this.unmuteAll);
        }
    }
    createAudio(args) {
        if (!isBrowser()) {
            return new Audio(args);
        }
        return new Audio(Object.assign(args, { player: this }));
    }
    muteAll() {
        if (!isBrowser())
            return;
        this.instances.forEach((ref) => {
            const player = ref.deref();
            if (player) {
                player.mute();
            }
        });
    }
    unmuteAll() {
        if (!isBrowser())
            return;
        this.instances.forEach((ref) => {
            const player = ref.deref();
            if (player) {
                player.unmute();
            }
        });
    }
    pauseAll() {
        if (!isBrowser())
            return;
        this.instances.forEach((ref) => {
            const player = ref.deref();
            if (player) {
                player.pause();
            }
        });
    }
    stopAll() {
        if (!isBrowser())
            return;
        this.instances.forEach((ref) => {
            const player = ref.deref();
            if (player) {
                player.stop();
            }
        });
    }
    createAudioBuffer(input) {
        if (!isBrowser()) {
            return Promise.resolve(undefined);
        }
        ASSERT(AudioPlayer.GetContext(), "AudioContext is not initialized");
        if (this.cache.has(input)) {
            return this.cache.get(input);
        }
        this.cache.set(input, AudioPlayer.GetContext().decodeAudioData(input));
        return this.cache.get(input);
    }
    constructor() {
        Object.defineProperty(this, "instances", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        _AudioPlayer_muteOnBlur.set(this, false);
        if (!isBrowser())
            return;
        setInterval(() => {
            requestIdleCallback(() => {
                for (const ref of this.instances) {
                    if (!ref.deref()) {
                        this.instances.delete(ref);
                    }
                }
            });
        }, 10000);
    }
}
_AudioPlayer_muteOnBlur = new WeakMap();
(() => {
    if (isBrowser()) {
        if (!window.ELYSIA_AUDIO_CTX) {
            window.ELYSIA_AUDIO_CTX = new AudioContext();
        }
        const unlock = () => {
            document.removeEventListener("click", unlock);
            const source = AudioPlayer.GetContext().createBufferSource();
            source.buffer = AudioPlayer.GetContext().createBuffer(1, 1, 22050);
            source.connect(AudioPlayer.GetContext().destination);
            source.start();
            source.stop();
            source.disconnect();
        };
        document.addEventListener("click", unlock);
    }
})();
