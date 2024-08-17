import { ASSERT } from "./asserts";

/***********************************************************
    Utilities
************************************************************/

const isBrowser = ![typeof window, typeof document].includes("undefined");

const isServer = !isBrowser;

const clamp = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(max, value));

const ctx = isBrowser ? new AudioContext() : undefined;

export class SoundManager {
	context?: AudioContext = ctx;

	instances = new Set<WeakRef<Sound>>();

	cache = new Map<string | ArrayBuffer, Promise<AudioBuffer>>();

	debug = false;

	#gc?: NodeJS.Timeout;

	#muteOnBlur = false;

	get muteOnBlur() {
		return this.#muteOnBlur;
	}

	set muteOnBlur(value: boolean) {
		this.#muteOnBlur = value;

		if (isServer) return;

		if (value) {
			window.addEventListener("blur", this.muteAll);
			window.addEventListener("focus", this.unmuteAll);
		} else {
			window.removeEventListener("blur", this.muteAll);
			window.removeEventListener("focus", this.unmuteAll);
		}
	}

	create(input: string | ArrayBuffer, args: { loop?: boolean; nodes?: any[] }) {
		const sound = new Sound({ manager: this, input, args });
		this.instances.add(new WeakRef(sound));
		return sound;
	}

	muteAll() {
		if (isServer) return;
		this.instances.forEach((ref) => {
			const player = ref.deref();
			if (player) {
				player.mute();
			}
		});
	}

	unmuteAll() {
		if (isServer) return;
		this.instances.forEach((ref) => {
			const player = ref.deref();
			if (player) {
				player.unmute();
			}
		});
	}

	pauseAll() {
		if (isServer) return;
		this.instances.forEach((ref) => {
			const player = ref.deref();
			if (player) {
				player.pause();
			}
		});
	}

	stopAll() {
		if (isServer) return;
		this.instances.forEach((ref) => {
			const player = ref.deref();
			if (player) {
				player.stop();
			}
		});
	}

	createAudioBuffer(
		input: string | ArrayBuffer,
	): Promise<AudioBuffer | undefined> {
		if (isServer) {
			return Promise.resolve(undefined);
		}

		ASSERT(this.context, "AudioContext is not initialized");

		if (this.cache.has(input)) {
			return this.cache.get(input)!;
		}

		if (typeof input === "string") {
			const arrayBuffer = fetch(input).then((res) => res.arrayBuffer());
			const audioBuffer = arrayBuffer.then((ab) =>
				this.context!.decodeAudioData(ab),
			);
			this.cache.set(input, audioBuffer);
		} else {
			this.cache.set(input, this.context.decodeAudioData(input));
		}

		return this.cache.get(input)!;
	}

	constructor() {
		if (isBrowser) {
			const unlock = () => {
				document.removeEventListener("click", unlock);
				const source = this.context!.createBufferSource();
				source.buffer = this.context!.createBuffer(1, 1, 22050);
				source.connect(this.context!.destination);
				source.start();
				source.stop();
				source.disconnect();
			};

			document.addEventListener("click", unlock);

			this.#gc = setInterval(() => {
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

	destructor() {
		if (isServer) return;

		this.instances.forEach((ref) => {
			const player = ref.deref();
			if (player) {
				player.stop();
			}
		});

		clearInterval(this.#gc!);
	}
}

export enum SoundEvent {
	Load = 0,
	Error = 1,
	Play = 2,
	Pause = 3,
	Stop = 4,
	Mute = 5,
	Unmute = 6,
	Seek = 7,
}

export class Sound {
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

	#subscribers = new Set<(event: SoundEvent) => void>();

	#manager: SoundManager;

	constructor(args: {
		manager: SoundManager;
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
					this.#emit(SoundEvent.Load);
				})
				.catch((error) => {
					this.#error = error;
					this.#ready = false;
					this.#loading = false;
					this.#debug("Audio error", this.src || this.buffer, error);
					this.#emit(SoundEvent.Error);
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

		this.#emit(SoundEvent.Stop);
	};

	#destroySource(source: AudioBufferSourceNode) {
		this.#debug("Destroying source", source);

		source.disconnect();
		source.stop();
		source.removeEventListener("ended", this.#onAudioEnd);
	}

	#emit(event: SoundEvent) {
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

		this.#emit(SoundEvent.Play);
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

		this.#emit(SoundEvent.Pause);
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

		this.#emit(SoundEvent.Stop);
	}

	mute() {
		if (isServer) return;

		ASSERT(!!this.#gainNode, "Cannot mute before audio is loaded");

		this.#debug("Muting audio", this.src || this.buffer);

		this.#gainNode.gain.value = 0;

		this.#muted = true;

		this.#emit(SoundEvent.Mute);
	}

	unmute() {
		if (isServer) return;

		ASSERT(!!this.#gainNode, "Cannot unmute before audio is loaded");

		this.#debug("Unmuting audio", this.src || this.buffer);

		this.#gainNode.gain.value = this.volume;

		this.#muted = false;

		this.#emit(SoundEvent.Unmute);
	}

	toggleMute() {
		if (isServer) return;

		this.muted ? this.unmute() : this.mute();
	}

	seek(position: number) {
		if (isServer) return;

		this.#debug("Seeking audio", this.src || this.buffer, position);

		this.#position = clamp(position, 0, this.#duration);

		this.#emit(SoundEvent.Seek);

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

		return new Sound({
			manager: this.#manager,
			input: this.src || this.buffer!,
			args: {
				loop: this.loop,
				nodes: this.userNodes,
			},
		});
	}

	subscribe(callback: (event: SoundEvent) => void) {
		this.#debug("Subscribing to audio", this.src || this.buffer);

		this.#subscribers.add(callback);

		return () => {
			this.#subscribers.delete(callback);
		};
	}
}
