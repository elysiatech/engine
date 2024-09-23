import { ActorLifecycle, Destroyable } from "../Core/Lifecycle";
import { Actor } from "./Actor";

export class Behavior implements ActorLifecycle, Destroyable
{

	parent: Actor | null = null;

	get created() { return this.#created; }

	get destroyed() { return this.#destroyed; }

	get enabled() { return this.#enabled; }

	enable() { this._enable(); }

	disable() { this._disable(); }

	onCreate() {}

	onEnable() {}

	onStart() {}

	onUpdate(delta: number, elapsed: number) {}

	onDisable() {}

	onReparent(parent: Actor | null) {}

	_enable()
	{
		if(this.#enabled || this.#destroyed) return;
		this.#enabled = true;
		this.onEnable();
	}

	_disable()
	{
		if(!this.#enabled || this.#destroyed) return;
		this.#enabled = false;
		this.onDisable();
	}

	_create()
	{
		if(this.#created || this.#destroyed) return;
		this.#created = true;
		this.onCreate();
	}

	_start()
	{
		if(!this.#created || this.#started || this.#destroyed) return;
		this.#started = true;
		this.onStart();
	}

	_update(delta: number, elapsed: number)
	{
		if(!this.#started || this.#destroyed) return;
		this.onUpdate(delta, elapsed);
	}

	_reparent(parent: Actor | null)
	{
		this.parent = parent;
		this.onReparent(parent);
	}

	destructor()
	{
		this.#destroyed = true;
		this._disable();
	}

	#enabled = false;
	#created = false;
	#started = false;
	#destroyed = false;
}