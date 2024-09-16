import { ASSERT } from "../Core/Assert";
import { Audio } from "./Audio";

const isBrowser = ![typeof window, typeof document].includes("undefined");

const isServer = !isBrowser;

const ctx = isBrowser ? new AudioContext() : undefined;

export class AudioManager {
	context?: AudioContext = ctx;

	instances = new Set<WeakRef<Audio>>();

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
		const sound = new Audio({manager: this, input, args});
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