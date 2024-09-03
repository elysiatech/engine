import { ASSERT } from "../Core/Assert";
import { AudioManager } from "./AudioManager";

/***********************************************************
    Utilities
************************************************************/

const isBrowser = ![typeof window, typeof document].includes("undefined");

const isServer = !isBrowser;

const clamp = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(max, value));

export enum AudioEvent {
	Load = 0,
	Error = 1,
	Play = 2,
	Pause = 3,
	Stop = 4,
	Mute = 5,
	Unmute = 6,
	Seek = 7,
}

export class Audio {
	src?: string;

	buffer?: ArrayBuffer;

	audioBuffer?: AudioBuffer;

	userNodes: AudioNode[] = [];

	#loop = false;

	get loop() {
		return this.#loop;
	}

	set loop(value: boolean) {
		if (isServer) return;
		ASSERT(!!this.#source, "Cannot set loop before audio is loaded");
		this.#loop = value;
		this.#source.loop = value;
	}

	#volume = 1;

	get volume() {
		return this.#volume;
	}

	set volume(value: number) {
		if (isServer) return;
		ASSERT(!!this.#gainNode, "Cannot set volume before audio is loaded");
		this.#volume = clamp(value, 0, 1);
		this.#gainNode.gain.value = this.#volume;
	}

	#position = 0;

	get position() {
		return this.#position;
	}

	set position(value: number) {
		this.seek(value);
	}

	get duration() {
		return this.#duration;
	}
	#duration = 0;

	#loading?: boolean = true;

	get loading() {
		return this.#loading;
	}

	#error?: Error;

	get error() {
		return this.#error;
	}

	#ready = false;

	get ready() {
		return this.#ready;
	}

	#playing = false;

	get playing() {
		return this.#playing;
	}

	#paused = false;

	get paused() {
		return this.#paused;
	}

	#stopped = true;

	get stopped() {
		return this.#stopped;
	}

	#muted = false;

	get muted() {
		return this.#muted;
	}

	#source?: AudioBufferSourceNode;

	#gainNode?: GainNode;

	#startedAt?: number;

	#subscribers = new Set<(event: AudioEvent) => void>();

	#manager: AudioManager;

	constructor(args: {
		manager: AudioManager;
		input: string | ArrayBuffer;
		args: { loop?: boolean; nodes?: any[]; sprite?: [number, number] };
	}) {
		this.#manager = args.manager;

		this.src = typeof args.input === "string" ? args.input : undefined;

		this.buffer = typeof args.input === "string" ? undefined : args.input;

		this.loop = args.args.loop || false;

		this.userNodes = args.args.nodes || [];

		if (isBrowser) {
			args.manager
				.createAudioBuffer(args.input)
				.then((audioBuffer) => {
					if (!audioBuffer) {
						throw new Error("Failed to create audio buffer");
					}
					this.audioBuffer = audioBuffer;
					this.#duration = audioBuffer.duration;
					this.#ready = true;
					this.#loading = false;
					this.#debug("Audio loaded", this.src || this.buffer);
					this.#emit(AudioEvent.Load);
				})
				.catch((error) => {
					this.#error = error;
					this.#ready = false;
					this.#loading = false;
					this.#debug("Audio error", this.src || this.buffer, error);
					this.#emit(AudioEvent.Error);
				});
		}
	}

	#debug(...args: any[]) {
		if (this.#manager.debug) {
			console.log(`[AudioPlayer]`, ...args);
		}
	}

	#onAudioEnd = () => {
		this.#debug("Audio ended", this.src || this.buffer);

		this.#paused = false;
		this.#stopped = true;
		this.#playing = false;
		this.position = 0;

		this.#emit(AudioEvent.Stop);
	};

	#destroySource(source: AudioBufferSourceNode) {
		this.#debug("Destroying source", source);

		source.disconnect();
		source.stop();
		source.removeEventListener("ended", this.#onAudioEnd);
	}

	#emit(event: AudioEvent) {
		this.#debug("Emitting event", event);
		this.#subscribers.forEach((callback) => callback(event));
	}

	fire() {
		if (isServer) return;

		if (!this.ready || !this.audioBuffer) {
			return;
		}

		ASSERT(!!this.#manager.context, "AudioContext is not initialized");
		ASSERT(!!this.#gainNode, "Audio buffer is not initialized");

		const src = this.#manager.context.createBufferSource();
		src.buffer = this.audioBuffer;
		src.connect(this.#gainNode).connect(this.#manager.context.destination);
		src.start(0);
	}

	play() {
		if (isServer) return;

		if (this.loading || !this.audioBuffer || this.playing) {
			return;
		}

		ASSERT(!!this.#manager.context, "AudioContext is not initialized");
		ASSERT(!!this.#gainNode, "Audio buffer is not initialized");

		this.#debug("Playing audio", this.src || this.buffer);
		this.#source = this.#manager.context.createBufferSource();
		this.#source.buffer = this.audioBuffer;
		this.#source.loop = this.loop;
		this.#source.connect(this.#gainNode);
		this.#debug("User nodes", this.userNodes);

		let nextNode: AudioNode = this.#gainNode;
		for (const node of this.userNodes) {
			nextNode.connect(node);
			nextNode = node;
		}

		nextNode.connect(this.#manager.context.destination);

		this.#debug("Connected to destination");

		this.#source.start(0, this.position);
		this.#startedAt = this.#manager.context.currentTime;
		this.#playing = true;
		this.#paused = false;
		this.#stopped = false;

		this.#source.addEventListener("ended", this.#onAudioEnd);

		this.#emit(AudioEvent.Play);
	}

	pause() {
		if (isServer) return;

		ASSERT(this.#manager.context, "AudioContext is not initialized");
		ASSERT(this.#source, "No source to pause");

		this.#debug("Pausing audio", this.src || this.buffer);

		this.#destroySource(this.#source);
		this.#playing = false;
		this.position += this.#manager.context.currentTime - (this.#startedAt ?? 0);
		this.#paused = true;
		this.#stopped = false;

		this.#emit(AudioEvent.Pause);
	}

	togglePlay() {
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
	}

	stop() {
		if (isServer) return;

		ASSERT(this.#source, "No source to stop");

		this.#debug("Stopping audio", this.src || this.buffer);

		this.#destroySource(this.#source);

		this.#playing = false;

		this.#paused = false;

		this.#stopped = true;

		this.position = 0;

		this.#emit(AudioEvent.Stop);
	}

	mute() {
		if (isServer) return;

		ASSERT(!!this.#gainNode, "Cannot mute before audio is loaded");

		this.#debug("Muting audio", this.src || this.buffer);

		this.#gainNode.gain.value = 0;

		this.#muted = true;

		this.#emit(AudioEvent.Mute);
	}

	unmute() {
		if (isServer) return;

		ASSERT(!!this.#gainNode, "Cannot unmute before audio is loaded");

		this.#debug("Unmuting audio", this.src || this.buffer);

		this.#gainNode.gain.value = this.volume;

		this.#muted = false;

		this.#emit(AudioEvent.Unmute);
	}

	toggleMute() {
		if (isServer) return;

		this.muted ? this.unmute() : this.mute();
	}

	seek(position: number) {
		if (isServer) return;

		this.#debug("Seeking audio", this.src || this.buffer, position);

		this.#position = clamp(position, 0, this.#duration);

		this.#emit(AudioEvent.Seek);

		if (this.playing) {
			ASSERT(!!this.#source, "No source to seek");

			this.#destroySource(this.#source);

			this.#playing = false;

			this.play();
		}
	}

	clone() {
		if (!this.src && !this.buffer)
			throw new Error(
				"Cannot clone an audio instance without a source or buffer",
			);

		this.#debug("Cloning audio", this.src || this.buffer);

		return new Audio({
			manager: this.#manager,
			input: this.src || this.buffer!,
			args: {
				loop: this.loop,
				nodes: this.userNodes,
			},
		});
	}

	subscribe(callback: (event: AudioEvent) => void) {
		this.#debug("Subscribing to audio", this.src || this.buffer);

		this.#subscribers.add(callback);

		return () => {
			this.#subscribers.delete(callback);
		};
	}
}
