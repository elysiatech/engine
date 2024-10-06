import { ActorLifecycle, Destroyable } from "../Core/Lifecycle";
import { Actor } from "./Actor";
import { Scene } from "./Scene";
import { Application } from "../Core/Application";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { TagAddedEvent } from "../Core/ElysiaEvents";

/**
 * A behavior is a component that can be attached to an actor to add functionality.
 * It has no children but participates in the actor lifecycle.
 */
export class Behavior implements ActorLifecycle, Destroyable
{
	public readonly type: string = "Behavior";

	get created() { return this.#created; }

	get started() { return this.#started; }

	get destroyed() { return this.#destroyed; }

	get enabled() { return this.#enabled; }

	/**
	 * The parent actor of this behavior.
	 */
	parent: Actor | null = null;

	/**
	 * The scene this behavior belongs
	 * to, if any.
	 */
	scene: Scene | null = null;

	/**
	 * The application this behavior belongs to.
	 */
	app: Application | null = null;

	readonly tags = new Set<any>;

	/**
	 * Enable this behavior.
	 */
	enable() { this._onEnable(); }

	/**
	 * Disable this behavior.
	 */
	disable() { this._onDisable(); }

	/**
	 * Adds a tag to this behavior
	 * @param tag
	 */
	addTag(tag: any)
	{
		ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
		this.tags.add(tag);
	}

	/**
	 * Removes a tag from this behavior.
	 * @param tag
	 */
	removeTag(tag: any)
	{
		ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
		this.tags.delete(tag);
	}

	/* **********************************************************
	    Lifecycle methods
	************************************************************/

	onCreate() {}

	onEnable() {}

	onStart() {}

	onEnterScene() {}

	onBeforePhysicsUpdate(delta: number, elapsed: number) {}

	onUpdate(delta: number, elapsed: number) {}

	onDisable() {}

	onLeaveScene() {}

	onDestroy() {}

	onReparent(parent: Actor | null) {}

	destructor()
	{
		this.#destroyed = true;
		this._onDisable()
		this._onDestroy();
	}

	/* **********************************************************
	    Internal methods
	************************************************************/

	/** @internal */ _onEnable() {
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot enable a destroyed behavior:", this);
			return;
		}
		if (this.#enabled) return;
		this.#enabled = true;
		this.onEnable();
	}

	/** @internal */ _onDisable() {
		if (!this.#enabled) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot disable a destroyed behavior:", this);
			return;
		}
		this.#enabled = false;
		this.onDisable();
	}

	/** @internal */ _onCreate() {
		if (this.#created) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot create a destroyed behavior:", this);
			return;
		}
		this.#created = true;
		this.onCreate();
	}

	/** @internal */ _onStart() {
		if (this.#started) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot start a destroyed behavior:", this);
			return;
		}
		this.#started = true;
		this.onStart();
	}

	/** @internal */ _onEnterScene() {
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot enter scene a destroyed behavior:", this);
			return;
		}
		this.onEnterScene();
	}

	/** @internal */ _onBeforePhysicsUpdate(delta: number, elapsed: number) {
		if(this.destroyed) return;
		this.onBeforePhysicsUpdate(delta, elapsed);
	}

	/** @internal */ _onUpdate(delta: number, elapsed: number) {
		if(this.destroyed) return;
		this.onUpdate(delta, elapsed);
	}

	/** @internal */ _onLeaveScene() {
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot leave scene a destroyed behavior:", this);
			return;
		}
		this.onLeaveScene();
	}

	/** @internal */ _onDestroy() {
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot destroy a destroyed behavior:", this);
			return;
		}
		this.#destroyed = true;
		this.onDestroy();
	}

	/** @internal */ _onReparent(parent: Actor | null) {
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot reparent a destroyed behavior:", this);
			return;
		}
		this.onReparent(parent);
	}

	#enabled = false;
	#created = false;
	#started = false;
	#destroyed = false;
}