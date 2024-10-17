import { ActorLifecycle, Destroyable } from "../Core/Lifecycle.ts";
import { Actor } from "./Actor.ts";
import { Scene } from "./Scene.ts";
import { Application } from "../Core/ApplicationEntry.ts";
import { ELYSIA_LOGGER } from "../Core/Logger.ts";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.ts";
import { TagAddedEvent } from "../Core/ElysiaEvents.ts";
import {
	Internal,
	OnBeforePhysicsUpdate,
	OnCreate, OnDestroy,
	OnDisable,
	OnEnable,
	OnEnterScene, OnLeaveScene, OnReparent, OnResize,
	OnStart, OnUpdate
} from "../Core/Internal.ts";
import { bound } from "../Core/Utilities.ts";
import { reportLifecycleError } from "../Core/Error.ts";
import * as Three from "three";
import { isDev } from "../Core/Asserts.ts";

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
	get parent() { return this[Internal].parent!; }

	/**
	 * The scene this behavior belongs
	 * to, if any.
	 */
	get scene() { return this[Internal].scene!; }

	/**
	 * The application this behavior belongs to.
	 */
	get app() { return this[Internal].app!; }

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

	@bound onCreate() {}

	@bound onEnterScene() {}

	@bound onEnable() {}

	@bound onStart() {}

	@bound onBeforePhysicsUpdate(delta: number, elapsed: number) {}

	@bound onUpdate(delta: number, elapsed: number) {}

	@bound onDisable() {}

	@bound onLeaveScene() {}

	@bound onDestroy() {}

	@bound onReparent(parent: Actor | null) {}

	@bound onResize(width: number, height: number) {}

	destructor()
	{
		if(this[Internal].destroyed) return;
		this[OnLeaveScene]();
		this[OnDisable]();
		this[OnDestroy]();
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

	@reportLifecycleError @bound [OnEnable](force = false)
	{
		if(!force && !this[Internal].enabled) return;
		if(this[Internal].destroyed)  return;
		this[Internal].enabled = true;
		this.onEnable();
	}

	@reportLifecycleError @bound [OnDisable]()
	{
		if(!this[Internal].enabled || this[Internal].destroyed) return;
		this[Internal].enabled = false;
		this.onDisable();
	}

	@reportLifecycleError @bound [OnCreate]()
	{
		if(this[Internal].created) return;
		if(this[Internal].destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to create a destroyed behavior: ${this}`);
			return;
		}
		this.onCreate();
		this.app!.renderPipeline.getRenderer().getSize(tempVec2)
		this.onResize(tempVec2.x,tempVec2.y)
		this[Internal].created = true;
	}

	@reportLifecycleError @bound [OnEnterScene]()
	{
		if(this[Internal].inScene) return;
		if(!this[Internal].created) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to add a destroyed behavior to actor: ${this}`);
			return;
		}
		this.onEnterScene();
		this[Internal].inScene = true;
	}

	@reportLifecycleError @bound [OnStart]()
	{
		if(this[Internal].started) return;
		if(!this[Internal].inScene) return;
		if(this[Internal].destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to start a destroyed behavior: ${this}`);
			return;
		}
		this.onStart();
		this[Internal].started = true;
	}

	@reportLifecycleError @bound [OnBeforePhysicsUpdate](delta: number, elapsed: number)
	{
		if(!this[Internal].enabled  || !this[Internal].inScene) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to update a destroyed behavior: ${this}`);
			return;
		}
		if(!this[Internal].started) this[OnStart]();
		this.onBeforePhysicsUpdate(delta, elapsed);
	}

	@reportLifecycleError @bound [OnUpdate](delta: number, elapsed: number)
	{
		if(!this[Internal].enabled || !this[Internal].inScene) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to update a destroyed behavior: ${this}`);
			return;
		}
		if(!this[Internal].started) this[OnStart]();
		this.onUpdate(delta, elapsed);
	}

	@reportLifecycleError @bound [OnLeaveScene]()
	{
		if(this[Internal].destroyed) return;
		if(!this[Internal].inScene) return;
		this.onLeaveScene();
		this[Internal].inScene = false;
	}

	@reportLifecycleError @bound [OnDestroy]()
	{
		if(this[Internal].destroyed) return;
		this.onDestroy()
		this[Internal].destroyed = true;
	}

	@reportLifecycleError @bound [OnReparent](newParent: Actor | null)
	{
		if(newParent === this[Internal].parent)
		{
			if(isDev()) ELYSIA_LOGGER.warn(`Trying to reparent actor to the same parent: ${this}`);
		}
		this[Internal].parent = newParent;
		this.onReparent(newParent);
	}

	@reportLifecycleError @bound [OnResize](width: number, height: number)
	{
		this.onResize(width, height);
	}
}

const tempVec2 = new Three.Vector2();
