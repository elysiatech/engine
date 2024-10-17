import * as Three from "three";
import { ActorLifecycle, Destroyable } from "../Core/Lifecycle.ts";
import { ELYSIA_LOGGER } from "../Core/Logger.ts";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.ts";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent } from "../Core/ElysiaEvents.ts";
import { Component, isActor } from "./Component.ts";
import { Scene } from "./Scene.ts";
import { Application } from "../Core/ApplicationEntry.ts";
import { isDev } from "../Core/Asserts.ts";
import { bound, Constructor } from "../Core/Utilities.ts";
import { ComponentSet } from "../Containers/ComponentSet.ts";
import {
	Internal,
	OnBeforePhysicsUpdate, OnCreate, OnDestroy, OnDisable, OnEnable,
	OnEnterScene,
	OnLeaveScene,
	OnReparent, OnResize,
	OnStart,
	OnUpdate
} from "../Core/Internal.ts";
import { reportLifecycleError } from "../Core/Error.ts";

export const IsActor = Symbol.for("Elysia::IsActor");

export class Actor<T extends Three.Object3D = Three.Object3D> implements ActorLifecycle, Destroyable
{
	[IsActor] = true;

	public readonly type: string = "Actor";

	/**
	 * The underlying Three.js object.
	 * This should be used with caution, as it can break the internal state of the actor in some cases.
	 */
	get object3d() { return this[Internal].object3d; }
	set object3d(object3d: T) { this.updateObject3d(object3d); }

	get created() { return this[Internal].created; }

	get enabled() { return this[Internal].enabled; }

	get started() { return this[Internal].started; }

	get inScene() { return this[Internal].inScene; }

	get destroyed() { return this[Internal].destroyed; }

	get app() { return this[Internal].app!; }

	get scene() { return this[Internal].scene!; }

	get parent() { return this[Internal].parent!; }

	get position() { return this[Internal].object3d.position; }
	set position(position: Three.Vector3) { this[Internal].object3d.position.copy(position); }

	get rotation() { return this[Internal].object3d.rotation; }
	set rotation(rotation: Three.Euler) { this[Internal].object3d.rotation.copy(rotation); }

	get scale() { return this[Internal].object3d.scale; }
	set scale(scale: Three.Vector3) { this[Internal].object3d.scale.copy(scale); }

	get quaternion() { return this[Internal].object3d.quaternion; }
	set quaternion(quaternion: Three.Quaternion) { this[Internal].object3d.quaternion.copy(quaternion); }

	readonly components = new Set<Component>;

	readonly tags = new Set<any>;

	/* **********************************************************
	    Lifecycle methods
	************************************************************/

	@bound onCreate() {}

	@bound onEnable() {}

	@bound onStart() {}

	@bound onEnterScene() {}

	@bound onBeforePhysicsUpdate(delta: number, elapsed: number) {}

	@bound onUpdate(delta: number, elapsed: number) {}

	@bound onLeaveScene() {}

	@bound onDisable() {}

	@bound onDestroy() {}

	@bound onReparent(parent: Actor | null) {}

	@bound onResize(width: number, height: number) {}

	/* **********************************************************
	    Public methods
	************************************************************/

	@bound updateObject3d(object3d: T)
	{
		if(this[Internal].object3d === object3d) return;

		const parent = this[Internal].object3d.parent;

		this[Internal].object3d.parent?.remove(this[Internal].object3d);
		this[Internal].object3d.actor = undefined;

		// set this actor as the actor of the object3d
		object3d.actor = this;
		this[Internal].object3d = object3d;

		if(!object3d.hasElysiaEvents) {
			object3d.addEventListener("added", (e) =>
			{
				object3d.actor?.[OnEnterScene]();
			})
			object3d.addEventListener("removed", (e) =>
			{
				object3d.actor?.[OnLeaveScene]();
			})
			object3d.hasElysiaEvents = true;
		}

		if(parent)
		{
			parent.add(object3d);
		}
	}

	/**
	 * Enables this actor. This means it receives updates and is visible.
	 */
	@bound enable() { this[OnEnable](true); }

	/**
	 * Disables this actor. This means it does not receive updates and is not visible.
	 */
	@bound disable() { this[OnDisable](); }

	/**
	 * Adds a tag to this actor.
	 * @param tag
	 */
	@bound addTag(tag: any)
	{
		ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
		this.tags.add(tag);
	}

	/**
	 * Removes a tag from this actor.
	 * @param tag
	 */
	@bound removeTag(tag: any)
	{
		ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
		this.tags.delete(tag);
	}

	/**
	 * Adds a component to this actor.
	 * @param component
	 * @returns `true` if the component was successfully added, `false` otherwise.
	 */
	@bound addComponent(component: Component): boolean
	{
		if(this[Internal].destroyed)
		{
			ELYSIA_LOGGER.warn("Trying to add component to a destroyed actor");
			return false;
		}
		if(component.destroyed)
		{
			ELYSIA_LOGGER.warn("Trying to add destroyed component to actor");
			return false;
		}

		this.components.add(component);

		if(!this[Internal].componentsByType.has(component.constructor as Constructor<Component>))
		{
			this[Internal].componentsByType.set(component.constructor as Constructor<Component>, new ComponentSet);
		}

		this[Internal].componentsByType.get(component.constructor as Constructor<Component>)!.add(component);

		if(isActor(component))
		{
			for(const tag of component.tags)
			{
				if(!this[Internal].componentsByTag.has(tag))
				{
					this[Internal].componentsByTag.set(tag, new ComponentSet);
				}
				this[Internal].componentsByTag.get(tag)!.add(component);
			}
		}

		ElysiaEventDispatcher.dispatchEvent(new ComponentAddedEvent({ parent: this, child: component }));

		component[Internal].parent = this;
		component[Internal].scene = this[Internal].scene;
		component[Internal].app = this[Internal].app;

		if(this[Internal].created) component[OnCreate]();

		if(this[Internal].inScene)
		{
			if(isActor(component)) this.object3d.add(component.object3d);
			component[OnEnterScene]();
		}

		if(this[Internal].inScene && this[Internal].enabled) component[OnEnable]();

		return true;
	}

	/**
	 * Removes a component from this actor.
	 * @param component
	 * @returns `true` if the component was successfully removed, `false` otherwise.
	 */
	@bound removeComponent(component: Component): boolean
	{
		if(this[Internal].destroyed)
		{
			ELYSIA_LOGGER.warn("Trying to remove component from a destroyed actor");
			return false;
		}
		if(component.destroyed)
		{
			ELYSIA_LOGGER.warn("Trying to remove destroyed component from actor");
			return false;
		}

		ElysiaEventDispatcher.dispatchEvent(new ComponentRemovedEvent({ parent: this, child: component }));

		this.components.delete(component);

		this[Internal].componentsByType.get(component.constructor as Constructor<Component>)?.delete(component);

		if(isActor(component))
		{
			for(const tag of component.tags)
			{
				this[Internal].componentsByTag.get(tag)?.delete(component);
			}
		}

		component[OnLeaveScene]();
		isActor(component) && this.object3d.remove(component.object3d);
		component[OnDisable]();
		return true;
	}

	/**
	 * Gets all components of a certain type directly attached to this actor.
	 */
	@bound getComponentsByType<T extends Component>(type: Constructor<T>): ComponentSet<T>
	{
		const set = (this[Internal].componentsByType.get(type) as ComponentSet<T> | undefined);
		if(!set)
		{
			const newSet = new ComponentSet<T>;
			(this[Internal].componentsByType.set(type, newSet));
			return newSet;
		}
		else return set;
	}

	/**
	 * Gets all components with a certain tag directly attached to this actor.
	 */
	@bound getComponentsByTag(tag: any): ComponentSet<Component>
	{
		const set = (this[Internal].componentsByTag.get(tag) as ComponentSet<Component> | undefined);
		if(!set)
		{
			const newSet = new ComponentSet<Component>;
			(this[Internal].componentsByTag.set(tag, newSet));
			return newSet;
		}
		else return set;
	}

	/**
	 * Destroys this actor and all its components.
	 * Recursively destroys all children actors, starting from the deepest children.
	 */
	@bound destructor() {
		if(this[Internal].destroyed) return;
		for(const component of this.components)
		{
			component.destructor();
		}
		this[OnDisable]();
		this[Internal].parent?.removeComponent(this);
		this[OnDestroy]();
		this[Internal].object3d.actor = undefined;
		this[Internal].object3d.parent?.remove(this[Internal].object3d);
		this[Internal].parent = null;
		this[Internal].scene = null;
		this[Internal].app = null;
		this[Internal].destroyed = true;
	}

	/* **********************************************************
	    Internal
	************************************************************/

	[Internal] = {
		object3d: ((e: Three.Object3D) => (e.actor = this, e))(new Three.Object3D) as T,
		parent: null as Actor | null,
		scene: null as Scene | null,
		app: null as Application | null,
		created: false,
		started: false,
		enabled: true,
		_enabled: false,
		inScene: false,
		destroyed: false,
		componentsByType: new Map<Constructor<Component>, ComponentSet<Component>>,
		componentsByTag: new Map<any, ComponentSet<Component>>,
	};

	@reportLifecycleError @bound [OnEnable](force = false)
	{
		if(!force && !this[Internal].enabled) return;
		if(this[Internal]._enabled || this[Internal].destroyed)  return;
		this[Internal].enabled = true;
		this[Internal]._enabled = true;
		this.object3d.visible = true;
		this.onEnable();
		for(const component of this.components)
		{
			component[OnEnable]();
		}
	}

	@reportLifecycleError @bound [OnDisable]()
	{
		if(!this[Internal].enabled || this[Internal].destroyed) return;
		this[Internal].enabled = false;
		this[Internal]._enabled = false;
		this.object3d.visible = false;
		this.onDisable();
		for(const component of this.components)
		{
			component[OnDisable]();
		}
	}

	@reportLifecycleError @bound [OnCreate]()
	{
		if(this[Internal].created) return;
		if(this[Internal].destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to create a destroyed actor: ${this}`);
			return;
		}
		this.onCreate();
		this.app!.renderPipeline.getRenderer().getSize(tempVec2)
		this.onResize(tempVec2.x,tempVec2.y)
		this[Internal].created = true;
		for(const component of this.components)
		{
			component[Internal].app = this.app;
			component[Internal].scene = this.scene;
			component[Internal].parent = this;
			if(!component.created) component[OnCreate]();
		}
	}

	@reportLifecycleError @bound [OnEnterScene]()
	{
		if(this[Internal].inScene || !this[Internal].created) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to add a destroyed actor to scene: ${this}`);
			return;
		}
		this.onEnterScene();
		this[Internal].inScene = true;
		for(const component of this.components)
		{
			if(isActor(component)) this.object3d.add(component.object3d);
			component[OnEnterScene]();
		}
	}

	@reportLifecycleError @bound [OnStart]()
	{
		if(this[Internal].started) return;
		if(!this[Internal].inScene || !this.enabled) return;
		if(this[Internal].destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to start a destroyed actor: ${this}`);
			return;
		}
		this.onStart();
		this[Internal].started = true;
		for(const component of this.components)
		{
			if(!component.started) component[OnStart]();
		}
	}

	@reportLifecycleError @bound [OnBeforePhysicsUpdate](delta: number, elapsed: number)
	{
		if(!this[Internal].enabled  || !this[Internal].inScene) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
			return;
		}
		if(!this[Internal].started) this[OnStart]();
		this.onBeforePhysicsUpdate(delta, elapsed);
		for(const component of this.components)
		{
			component[OnBeforePhysicsUpdate](delta, elapsed);
		}
	}

	@reportLifecycleError @bound [OnUpdate](delta: number, elapsed: number)
	{
		if(!this[Internal].enabled || !this[Internal].inScene) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
			return;
		}
		if(!this[Internal].started) this[OnStart]();
		this.onUpdate(delta, elapsed);
		for(const component of this.components)
		{
			component[OnUpdate](delta, elapsed);
		}
	}

	@reportLifecycleError @bound [OnLeaveScene]()
	{
		if(this[Internal].destroyed) return;
		if(!this[Internal].inScene) return;
		this.onLeaveScene();
		this[Internal].inScene = false;
		for(const component of this.components)
		{
			component[OnLeaveScene]();
			if(isActor(component)) component.object3d.removeFromParent()
		}
	}

	@reportLifecycleError @bound [OnDestroy]()
	{
		if(this[Internal].destroyed) return;
		this.onDestroy()
		this[Internal].destroyed = true;
		for(const component of this.components) component.onDestroy();
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
		for(const component of this.components) component[OnResize](width, height);
	}
}

const tempVec2 = new Three.Vector2();
