import * as Three from "three";
import { ActorLifecycle, Destroyable } from "../Core/Lifecycle";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent } from "../Core/ElysiaEvents";
import { Component, isActor } from "./Component";
import { Scene } from "./Scene";
import { Application } from "../Core/ApplicationEntry.ts";
import { isDev } from "../Core/Asserts";
import { bound, Constructor } from "../Core/Utilities";
import { SparseSet } from "../Containers/SparseSet.ts";
import { Behavior } from "./Behavior.ts";

export const IsActor = Symbol("IsActor");

export class Actor<T extends Three.Object3D = Three.Object3D> implements ActorLifecycle, Destroyable
{
	[IsActor] = true;

	public readonly type: string = "Actor";

	/**
	 * The underlying Three.js object.
	 * This should be used with caution, as it can break the internal state of the actor in some cases.
	 */
	get object3d() { return this.#object3d; }
	set object3d(object3d: T) { this.updateObject3d(object3d); }

	get created() { return this.#created; }

	get enabled() { return this.#enabled; }

	get started() { return this.#started; }

	get inScene() { return this.#inScene; }

	get destroyed() { return this.#destroyed; }

	get position() { return this.#object3d.position; }
	set position(position: Three.Vector3) { this.#object3d.position.copy(position); }

	get rotation() { return this.#object3d.rotation; }
	set rotation(rotation: Three.Euler) { this.#object3d.rotation.copy(rotation); }

	get scale() { return this.#object3d.scale; }
	set scale(scale: Three.Vector3) { this.#object3d.scale.copy(scale); }

	get quaternion() { return this.#object3d.quaternion; }
	set quaternion(quaternion: Three.Quaternion) { this.#object3d.quaternion.copy(quaternion); }

	readonly components = new Set<Component>;

	readonly tags = new Set<any>;

	/**
	 * The parent actor of this behavior.
	 */
	parent: Actor<any> | null = null;

	/**
	 * The scene this behavior belongs
	 * to, if any.
	 */
	scene: Scene | null = null;

	/**
	 * The application this behavior belongs to.
	 */
	app: Application | null = null;

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

	/* **********************************************************
	    Public methods
	************************************************************/

	@bound updateObject3d(object3d: T)
	{
		if(this.#object3d === object3d) return;

		this.#object3d.parent?.remove(this.#object3d);
		this.#object3d.actor = undefined;

		// set this actor as the actor of the object3d
		object3d.actor = this;
		this.#object3d = object3d;
	}

	/**
	 * Enables this actor. This means it receives updates and is visible.
	 */
	@bound enable() { this._onEnable(); }

	/**
	 * Disables this actor. This means it does not receive updates and is not visible.
	 */
	@bound disable() { this._onDisable(); }

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
		if(this.#destroyed)
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
		if(!this.#componentsByType.has(component.constructor as Constructor<Component>))
		{
			this.#componentsByType.set(component.constructor as Constructor<Component>, new SparseSet);
		}
		this.#componentsByType.get(component.constructor as Constructor<Component>)!.add(component);
		if(isActor(component))
		{
			for(const tag of component.tags)
			{
				if(!this.#componentsByTag.has(tag))
				{
					this.#componentsByTag.set(tag, new SparseSet);
				}
				this.#componentsByTag.get(tag)!.add(component);
			}
			this.object3d.add(component.object3d);
		}
		ElysiaEventDispatcher.dispatchEvent(new ComponentAddedEvent({ parent: this, child: component }));
		component.parent = this;
		component.scene = this.scene;
		component.app = this.app;
		if(this.#created)
		{
			component._onCreate();
		}
		if(this.#started)
		{
			component._onStart();
		}
		if(this.#inScene)
		{
			component._onEnterScene();
		}
		return true;
	}

	/**
	 * Removes a component from this actor.
	 * @param component
	 * @returns `true` if the component was successfully removed, `false` otherwise.
	 */
	@bound removeComponent(component: Component): boolean
	{
		if(this.#destroyed)
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
		this.#componentsByType.get(component.constructor as Constructor<Component>)?.delete(component);
		if(isActor(component))
		{
			for(const tag of component.tags)
			{
				this.#componentsByTag.get(tag)?.delete(component);
			}
			this.object3d.remove(component.object3d);
		}
		component._onLeaveScene();
		return true;
	}

	/**
	 * Reparents a component to this actor.
	 * @param component
	 * @returns `true` if the component was successfully reparented, `false` otherwise.
	 */
	@bound stealComponent(component: Component): boolean
	{
		if(this.#destroyed)
		{
			ELYSIA_LOGGER.warn("Trying to reparent component to a destroyed actor");
			return false;
		}
		if(component.destroyed)
		{
			ELYSIA_LOGGER.warn("Trying to reparent destroyed component to actor");
			return false;
		}
		this.components.add(component);
		if(isActor(component))
		{
			this.object3d.add(component.object3d);
		}
		component.parent = this;
		component._onReparent(this);
		component._onCreate();
		component._onEnable();
		component._onStart();
		component._onEnterScene();
		return true;
	}

	/**
	 * Reparents a component to another actor.
	 * @param component
	 * @param newParent
	 * @returns `true` if the component was successfully reparented, `false` otherwise.
	 */
	@bound giveComponent(component: Component, newParent: Actor): boolean
	{
		if(this.#destroyed)
		{
			ELYSIA_LOGGER.warn("Trying to give component to a destroyed actor");
			return false;
		}
		if(component.destroyed)
		{
			ELYSIA_LOGGER.warn("Trying to give destroyed component to actor");
			return false;
		}
		this.components.delete(component);
		if(isActor(component))
		{
			this.object3d.remove(component.object3d);
		}
		component.parent = newParent;
		component._onReparent(newParent);
		newParent.components.add(component);
		if(isActor(component))
		{
			newParent.object3d.add(component.object3d);
		}
		component._onCreate();
		component._onEnable();
		component._onStart();
		component._onEnterScene();
		return true;
	}

	/**
	 * Gets all components of a certain type directly attached to this actor.
	 */
	@bound getComponentsByType<T extends Component>(type: Constructor<T>): SparseSet<T>
	{
		return (this.#componentsByType.get(type) as SparseSet<T>) ?? new SparseSet<T>;
	}

	/**
	 * Gets all components with a certain tag directly attached to this actor.
	 */
	@bound getComponentsByTag(tag: any): SparseSet<Component>
	{
		return this.#componentsByTag.get(tag) ?? new SparseSet;
	}

	/**
	 * Destroys this actor and all its components.
	 * Recursively destroys all children actors, starting from the deepest children.
	 */
	@bound destructor() {
		if(this.#destroyed) return;
		for(const component of this.components)
		{
			component.destructor()
		}
		this._onLeaveScene();
		this.onDestroy();
		this.parent?.removeComponent(this);
		this.#object3d.actor = undefined;
		this.#object3d.parent?.remove(this.#object3d);
		this.parent = null;
		this.scene = null;
		this.app = null;
		this.#destroyed = true;
	}

	/* **********************************************************
	    Internal methods
	************************************************************/

	/** @internal */ @bound _onEnable(runEvenIfAlreadyEnabled: boolean = false)
	{
		if(this.#enabled && !runEvenIfAlreadyEnabled) return;
		this.#enabled = true;
		this.object3d.visible = true;
		this.onEnable();
		this._onStart();
		this._onEnterScene();
	}

	/** @internal */ @bound _onDisable()
	{
		if(!this.#enabled) return;
		this.#enabled = false;
		this.object3d.visible = false;
		this.onDisable();
	}

	/** @internal */ @bound _onCreate()
	{
		if(this.#created) return;
		if(this.#destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to create a destroyed actor: ${this}`);
			return;
		}
		this.#created = true;
		this.onCreate();
		for(const component of this.components)
		{
			component.scene = this.scene;
			component.app = this.app;
			component._onCreate();
		}
	}

	/** @internal */ @bound _onStart()
	{
		if(this.#started || !this.#enabled || !this.#created) return;
		if(this.#destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to start a destroyed actor: ${this}`);
			return;
		}
		this.#started = true;
		this.onStart();
		for(const component of this.components)
		{
			component._onStart();
		}
	}

	/** @internal */ @bound _onEnterScene()
	{
		if(this.#inScene) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to add a destroyed actor to scene: ${this}`);
			return;
		}
		if(!this.#started) return;
		if(!this.#enabled) return;
		this.#inScene = true;
		this._onEnable(true);
		for(const component of this.components)
		{
			component._onEnterScene();
		}
	}

	/** @internal */ @bound _onBeforePhysicsUpdate(delta: number, elapsed: number)
	{
		if(!this.#enabled) return;
		if(!this.#inScene) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
			return;
		}
		this.onBeforePhysicsUpdate(delta, elapsed);
		for(const component of this.components)
		{
			component._onBeforePhysicsUpdate(delta, elapsed);
		}
	}

	/** @internal */ @bound _onUpdate(delta: number, elapsed: number)
	{
		if(!this.#enabled) return;
		if(!this.#inScene) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
			return;
		}
		this.onUpdate(delta, elapsed);
		for(const component of this.components)
		{
			component._onUpdate(delta, elapsed);
		}
	}

	/** @internal */ @bound _onLeaveScene()
	{
		if(this.#destroyed) return;
		if(!this.#inScene) return;
		this.#inScene = false;
		this._onDisable();
		this.onLeaveScene();
		for(const component of this.components)
		{
			component._onLeaveScene();
		}
	}

	/** @internal */ @bound _onReparent(newParent: Actor | null)
	{
		if(newParent === this.parent)
		{
			if(isDev())
			{
				ELYSIA_LOGGER.warn(`Trying to reparent actor to the same parent: ${this}`);
			}
		}
		this.parent = newParent;
		this.onReparent(newParent);
	}

	#object3d: T = ((e: Three.Object3D) => (e.actor = this, e))(new Three.Object3D) as T;
	#created: boolean = false;
	#started: boolean = false;
	#enabled: boolean = true;
	#inScene: boolean = false;
	#destroyed: boolean = false;
	#componentsByType = new Map<Constructor<Component>, SparseSet<Component>>;
	#componentsByTag = new Map<any, SparseSet<Component>>;
}


export function ActorFactory<T extends Constructor<Three.Object3D>>(Parent: T)
{
	return class extends Parent implements ActorLifecycle, Destroyable
	{
		[IsActor] = true;

		get object3d() { return this }

		get created() { return this.#created; }

		get enabled() { return this.#enabled; }

		get started() { return this.#started; }

		get inScene() { return this.#inScene; }

		get destroyed() { return this.#destroyed; }

		get behaviors() { return this.#behaviors; }

		readonly tags = new Set<any>;

		override parent: Three.Object3D | null = null;

		scene?: Scene;

		app?: Application;

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

		/* **********************************************************
			Public methods
		************************************************************/

		/**
		 * Enables this actor. This means it receives updates and is visible.
		 */
		@bound enable() { this._onEnable(); }

		/**
		 * Disables this actor. This means it does not receive updates and is not visible.
		 */
		@bound disable() { this._onDisable(); }

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
		@bound override add(...components: Three.Object3D[]): this
		{
			super.add(...components);

			if(this.#destroyed)
			{
				ELYSIA_LOGGER.warn("Trying to add component to a destroyed actor");
				return this;
			}
			if(component.destroyed)
			{
				ELYSIA_LOGGER.warn("Trying to add destroyed component to actor");
				return this;
			}
			this.components.add(component);
			if(!this.#componentsByType.has(component.constructor as Constructor<Component>))
			{
				this.#componentsByType.set(component.constructor as Constructor<Component>, new SparseSet);
			}
			this.#componentsByType.get(component.constructor as Constructor<Component>)!.add(component);
			if(isActor(component))
			{
				for(const tag of component.tags)
				{
					if(!this.#componentsByTag.has(tag))
					{
						this.#componentsByTag.set(tag, new SparseSet);
					}
					this.#componentsByTag.get(tag)!.add(component);
				}
				this.object3d.add(component.object3d);
			}
			ElysiaEventDispatcher.dispatchEvent(new ComponentAddedEvent({ parent: this, child: component }));
			component.parent = this;
			component.scene = this.scene;
			component.app = this.app;
			if(this.#created)
			{
				component._onCreate();
			}
			if(this.#started)
			{
				component._onStart();
			}
			if(this.#inScene)
			{
				component._onEnterScene();
			}

			return this;
		}

		/**
		 * Removes a component from this actor.
		 * @param component
		 * @returns `true` if the component was successfully removed, `false` otherwise.
		 */
		@bound remove(...components: Three.Object3D): this
		{
			if(this.#destroyed)
			{
				ELYSIA_LOGGER.warn("Trying to remove component from a destroyed actor");
				return this;
			}
			if(component.destroyed)
			{
				ELYSIA_LOGGER.warn("Trying to remove destroyed component from actor");
				return this;
			}
			ElysiaEventDispatcher.dispatchEvent(new ComponentRemovedEvent({ parent: this, child: component }));
			this.components.delete(component);
			this.#componentsByType.get(component.constructor as Constructor<Component>)?.delete(component);
			if(isActor(component))
			{
				for(const tag of component.tags)
				{
					this.#componentsByTag.get(tag)?.delete(component);
				}
				this.object3d.remove(component.object3d);
			}
			component._onLeaveScene();
			return this;
		}

		/**
		 * Gets all components of a certain type directly attached to this actor.
		 */
		@bound getComponentsByType<T extends Component>(type: Constructor<T>): SparseSet<T>
		{
			return (this.#componentsByType.get(type) as SparseSet<T>) ?? new SparseSet<T>;
		}

		/**
		 * Gets all components with a certain tag directly attached to this actor.
		 */
		@bound getComponentsByTag(tag: any): SparseSet<Component>
		{
			return this.#componentsByTag.get(tag) ?? new SparseSet;
		}

		/**
		 * Destroys this actor and all its components.
		 * Recursively destroys all children actors, starting from the deepest children.
		 */
		@bound destructor() {
			if(this.#destroyed) return;
			for(const component of this.components)
			{
				component.destructor()
			}
			this._onLeaveScene();
			this.onDestroy();
			this.parent?.removeComponent(this);
			this.#object3d.actor = undefined;
			this.#object3d.parent?.remove(this.#object3d);
			this.parent = null;
			this.scene = null;
			this.app = null;
			this.#destroyed = true;
		}

		/* **********************************************************
			Internal methods
		************************************************************/

		/** @internal */ @bound _onEnable(runEvenIfAlreadyEnabled: boolean = false)
		{
			if(this.#enabled && !runEvenIfAlreadyEnabled) return;
			this.#enabled = true;
			this.object3d.visible = true;
			this.onEnable();
			this._onStart();
			this._onEnterScene();
		}

		/** @internal */ @bound _onDisable()
		{
			if(!this.#enabled) return;
			this.#enabled = false;
			this.object3d.visible = false;
			this.onDisable();
		}

		/** @internal */ @bound _onCreate()
		{
			if(this.#created) return;
			if(this.#destroyed)
			{
				ELYSIA_LOGGER.warn(`Trying to create a destroyed actor: ${this}`);
				return;
			}
			this.#created = true;
			this.onCreate();
			for(const component of this.components)
			{
				component.scene = this.scene;
				component.app = this.app;
				component._onCreate();
			}
		}

		/** @internal */ @bound _onStart()
		{
			if(this.#started || !this.#enabled || !this.#created) return;
			if(this.#destroyed)
			{
				ELYSIA_LOGGER.warn(`Trying to start a destroyed actor: ${this}`);
				return;
			}
			this.#started = true;
			this.onStart();
			for(const component of this.components)
			{
				component._onStart();
			}
		}

		/** @internal */ @bound _onEnterScene()
		{
			if(this.#inScene) return;
			if(this.destroyed)
			{
				ELYSIA_LOGGER.warn(`Trying to add a destroyed actor to scene: ${this}`);
				return;
			}
			if(!this.#started) return;
			if(!this.#enabled) return;
			this.#inScene = true;
			this._onEnable(true);
			for(const component of this.components)
			{
				component._onEnterScene();
			}
		}

		/** @internal */ @bound _onBeforePhysicsUpdate(delta: number, elapsed: number)
		{
			if(!this.#enabled) return;
			if(!this.#inScene) return;
			if(this.destroyed)
			{
				ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
				return;
			}
			this.onBeforePhysicsUpdate(delta, elapsed);
			for(const component of this.components)
			{
				component._onBeforePhysicsUpdate(delta, elapsed);
			}
		}

		/** @internal */ @bound _onUpdate(delta: number, elapsed: number)
		{
			if(!this.#enabled) return;
			if(!this.#inScene) return;
			if(this.destroyed)
			{
				ELYSIA_LOGGER.warn(`Trying to update a destroyed actor: ${this}`);
				return;
			}
			this.onUpdate(delta, elapsed);
			for(const component of this.components)
			{
				component._onUpdate(delta, elapsed);
			}
		}

		/** @internal */ @bound _onLeaveScene()
		{
			if(this.#destroyed) return;
			if(!this.#inScene) return;
			this.#inScene = false;
			this._onDisable();
			this.onLeaveScene();
			for(const component of this.components)
			{
				component._onLeaveScene();
			}
		}

		#behaviors = new SparseSet<Behavior>;
		#created: boolean = false;
		#started: boolean = false;
		#enabled: boolean = true;
		#inScene: boolean = false;
		#destroyed: boolean = false;
	}
}