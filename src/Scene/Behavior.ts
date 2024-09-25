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

	/* **********************************************************
	    Lifecycle methods
	************************************************************/

	onCreate() {}

	onEnable() {}

	onStart() {}

	onEnterScene() {}

	onUpdate(delta: number, elapsed: number) {}

	onDisable() {}

	onLeaveScene() {}

	onDestroy() {}

	onReparent(parent: Actor | null) {}

	destructor()
	{
		this.#destroyed = true;
		this._disable();
	}

	/* **********************************************************
	    Internal methods
	************************************************************/

	/** @internal */ _enable()
	{
		if(this.#enabled || this.#destroyed) return;
		this.#enabled = true;
		this.onEnable();
	}

	/** @internal */ _disable()
	{
		if(!this.#enabled || this.#destroyed) return;
		this.#enabled = false;
		this.onDisable();
	}

	/** @internal */ _create()
	{
		if(this.#created || this.#destroyed) return;
		this.#created = true;
		this.onCreate();
	}

	/** @internal */ _start()
	{
		if(!this.#created || this.#started || this.#destroyed) return;
		this.#started = true;
		this.onStart();
	}

	/** @internal */ _update(delta: number, elapsed: number)
	{
		if(!this.#started || this.#destroyed) return;
		this.onUpdate(delta, elapsed);
	}

	/** @internal */ _reparent(parent: Actor | null)
	{
		this.parent = parent;
		this.onReparent(parent);
	}

	#enabled = false;
	#created = false;
	#started = false;
	#destroyed = false;
}