type KeyState = {
	pressed: boolean;
};

type InputCallback = (key: string, states: Record<string, KeyState>) => void;

function createKeyState(): KeyState {
	return { pressed: false };
}

export class InputQueue {
	public queue: Array<{ key: string; state: KeyState }> = [];

	public enabled = false;

	constructor() {
		this.enable = this.enable.bind(this);
		this.disable = this.disable.bind(this);
		this.getKey = this.getKey.bind(this);
		this.onInputDown = this.onInputDown.bind(this);
		this.onInputUp = this.onInputUp.bind(this);
		this.onInput = this.onInput.bind(this);
		this.replay = this.replay.bind(this);
		this.keydown = this.keydown.bind(this);
		this.keyup = this.keyup.bind(this);

		typeof window !== "undefined" && this.enable();
	}

	enable() {
		this.enabled = true;
		window.addEventListener("keydown", this.keydown.bind(this));
		window.addEventListener("keyup", this.keyup.bind(this));
		window.addEventListener("mousedown", this.keydown.bind(this));
		window.addEventListener("mouseup", this.keyup.bind(this));
		window.addEventListener("wheel", this.keydown.bind(this));
	}

	disable() {
		this.enabled = false;
		window.removeEventListener("keydown", this.keydown.bind(this));
		window.removeEventListener("keyup", this.keyup.bind(this));
		window.removeEventListener("mousedown", this.keydown.bind(this));
		window.removeEventListener("mouseup", this.keyup.bind(this));
		window.removeEventListener("wheel", this.keydown.bind(this));
	}

	getCurrentState() {
		return this.states;
	}

	getKey(key: string): KeyState {
		return this.states[key] ?? createKeyState();
	}

	onInputDown(key: string | string[], callback: InputCallback): Function {
		const keys = Array.isArray(key) ? key : [key];
		const cleanup: Function[] = [];

		for (const k of keys) {
			if (!this.inputDownCallbacks.has(k)) {
				this.inputDownCallbacks.set(k, new Set());
			}
			this.inputDownCallbacks.get(k)!.add(callback);
			cleanup.push(() => void this.inputDownCallbacks.get(k)?.delete(callback));
		}
		return () => void cleanup.forEach((fn) => fn());
	}

	onInputUp(key: string | string[], callback: InputCallback): Function {
		const keys = Array.isArray(key) ? key : [key];
		const cleanup: Function[] = [];

		for (const k of keys) {
			if (!this.inputUpCallbacks.has(k)) {
				this.inputUpCallbacks.set(k, new Set());
			}
			this.inputUpCallbacks.get(k)!.add(callback);
			cleanup.push(() => void this.inputUpCallbacks.get(k)?.delete(callback));
		}
		return () => void cleanup.forEach((fn) => fn());
	}

	onInput(key: string | string[], callback: InputCallback): Function {
		const a = this.onInputDown(key, callback);
		const b = this.onInputUp(key, callback);
		return () => void (a(), b());
	}

	replay() {
		for (const e of this.queue) {
			const { key, state } = e;
			this.states[key] = state;
			if (state.pressed) {
				this.inputDownCallbacks.get(key)?.forEach((cb) => cb(key, this.states));
			} else {
				this.inputUpCallbacks.get(key)?.forEach((cb) => cb(key, this.states));
			}
		}

		this.queue.length = 0;
	}

	private states: Record<string, KeyState> = {};

	private inputDownCallbacks = new Map<string, Set<InputCallback>>();

	private inputUpCallbacks = new Map<string, Set<InputCallback>>();

	private keydown(e: KeyboardEvent | MouseEvent | WheelEvent) {
		if (!this.enabled) return;
		const key =
			e instanceof KeyboardEvent
				? e.key
				: e instanceof WheelEvent
					? `wheel${e.deltaY > 0 ? "Down" : "Up"}`
					: `mouse${e.button}`;
		this.queue.push({ key, state: { pressed: true } });
	}

	private keyup(e: KeyboardEvent | MouseEvent | WheelEvent) {
		if (!this.enabled) return;
		const key =
			e instanceof KeyboardEvent
				? e.key
				: e instanceof WheelEvent
					? `wheel${e.button}`
					: `mouse${e.button}`;

		this.queue.push({ key, state: { pressed: false } });
	}
}
