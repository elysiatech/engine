import { ActorLifecycle, Destroyable } from "../Core/Lifecycle";
import { Actor } from "./Actor";
import { Scene } from "./Scene";
import { Application } from "../Core/ApplicationEntry.ts";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { TagAddedEvent } from "../Core/ElysiaEvents";
import {
	Internal,
	OnBeforePhysicsUpdate,
	OnCreate,
	OnDisable,
	OnEnable,
	OnEnterScene, OnLeaveScene, OnReparent,
	OnStart, OnUpdate
} from "../Core/Internal.ts";

export const IsBehavior = Symbol.for("Elysia::IsBehavior");

/**
 * A behavior is a component that can be attached to an actor to add functionality.
 * It has no children but participates in the actor lifecycle.
 */
export class Behavior implements ActorLifecycle, Destroyable
{
	[IsBehavior] = true;

	readonly type: string = "Behavior";

	get created() { return this[Internal].created; }

	get started() { return this[Internal].started; }

	get destroyed() { return this[Internal].destroyed; }

	get enabled() { return this[Internal].enabled; }

	/**
	 * The parent actor of this behavior.
	 */
	get parent() { return this[Internal].parent; }

	/**
	 * The scene this behavior belongs
	 * to, if any.
	 */
	get scene() { return this[Internal].scene; }

	/**
	 * The application this behavior belongs to.
	 */
	get app() { return this[Internal].app; }

	/**
	 * The tags associated with this behavior.
	 */
	get tags() { return this[Internal].tags; }

	/** Enable this behavior. */
	enable() { this[OnEnable]() }

	/** Disable this behavior. */
	disable() { this[OnDisable]() }

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
		if(this[Internal].destroyed) return;
		this[OnLeaveScene]();
		this.onDestroy();
		this[Internal].parent = null;
		this[Internal].scene = null;
		this[Internal].app = null;
		this[Internal].destroyed = true;
	}

	/* **********************************************************
	    Internal
	************************************************************/

	[Internal] = {
		app: null as Application | null,
		scene: null as Scene | null,
		parent: null as Actor | null,
		tags: new Set<any>(),
		enabled: true,
		created: false,
		started: false,
		inScene: false,
		destroyed: false,
	};

	[OnEnable](runEvenIfAlreadyEnabled: boolean = false)
	{
		if (this[Internal].enabled && !runEvenIfAlreadyEnabled) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot enable a destroyed behavior:", this);
			return;
		}
		this[Internal].enabled = true;
		this.onEnable();
	}

	[OnDisable]() {
		if (!this[Internal].enabled) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot disable a destroyed behavior:", this);
			return;
		}
		this[Internal].enabled = false;
		this.onDisable();
	}

	[OnCreate]() {
		if (this[Internal].created) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot create a destroyed behavior:", this);
			return;
		}
		this[Internal].created = true;
		this.onCreate();
	}

	[OnStart]() {
		if (this[Internal].started) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot start a destroyed behavior:", this);
			return;
		}
		this[Internal].started = true;
		this.onStart();
	}

	[OnEnterScene]() {
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot enter scene a destroyed behavior:", this);
			return;
		}
		if(this[Internal].inScene) return;
		this[Internal].inScene = true;
		this[OnEnable](true);
		this.onEnterScene();
	}

	[OnBeforePhysicsUpdate](delta: number, elapsed: number) {
		if(this.destroyed) return;
		this.onBeforePhysicsUpdate(delta, elapsed);
	}

	[OnUpdate](delta: number, elapsed: number) {
		if(this.destroyed) return;
		this.onUpdate(delta, elapsed);
	}

	[OnLeaveScene]() {
		if(this.destroyed) return;
		if(!this[Internal].inScene) return;
		this[Internal].inScene = false;
		this[OnDisable]();
		this.onLeaveScene();
	}

	[OnReparent](parent: Actor | null) {
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn("Cannot reparent a destroyed behavior:", this);
			return;
		}
		this.onReparent(parent);
	}
}