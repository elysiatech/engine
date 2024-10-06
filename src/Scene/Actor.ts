import * as Three from "three";
import { ActorLifecycle, Destroyable } from "../Core/Lifecycle";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent } from "../Core/ElysiaEvents";
import { Component, isActor } from "./Component";
import { Scene } from "./Scene";
import { Application } from "../Core/Application";
import { isDev } from "../Core/Asserts";
import { Constructor } from "../Core/Utilities";
import { SparseSet } from "../Containers/SparseSet.ts";
import { track } from "../Core/Track.ts";

declare module 'three'
{
	export interface Object3D
	{
		actor?: Actor<any>;
	}
}

export class Actor<T extends Three.Object3D = Three.Object3D> implements ActorLifecycle, Destroyable
{
	public readonly type: string = "Actor";

	get object3d() { return this.#object3d; }

	set object3d(object3d: T)
	{
		if(this.#object3d === object3d) return;
		this.#object3d.parent?.remove(this.#object3d);
		this.#object3d.children.forEach(child => object3d.add(child));
		this.#object3d.actor = undefined;
		this.#object3d = object3d;
	}

	get created() { return this.#created; }

	get enabled() { return this.#enabled; }

	get started() { return this.#started; }

	get inScene() { return this.#inScene; }

	get destroyed() { return this.#destroyed; }

	readonly components = new Set<Component>;

	readonly tags = new Set<any>;

	get position() { return this.#object3d.position; }
	set position(position: Three.Vector3) { this.#object3d.position.copy(position); }

	get rotation() { return this.#object3d.rotation; }
	set rotation(rotation: Three.Euler) { this.#object3d.rotation.copy(rotation); }

	get scale() { return this.#object3d.scale; }
	set scale(scale: Three.Vector3) { this.#object3d.scale.copy(scale); }

	get quaternion() { return this.#object3d.quaternion; }
	set quaternion(quaternion: Three.Quaternion) { this.#object3d.quaternion.copy(quaternion); }

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

	constructor()
	{
		this.#object3d.actor = this;
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

	onLeaveScene() {}

	onDisable() {}

	onDestroy() {}

	onReparent(parent: Actor | null) {}

	/* **********************************************************
	    Public methods
	************************************************************/

	/**
	 * Enables this actor. This means it receives updates and is visible.
	 */
	enable() { this._onEnable(); }

	/**
	 * Disables this actor. This means it does not receive updates and is not visible.
	 */
	disable() { this._onDisable(); }

	/**
	 * Adds a tag to this actor.
	 * @param tag
	 */
	addTag(tag: any)
	{
		ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
		this.tags.add(tag);
	}

	/**
	 * Removes a tag from this actor.
	 * @param tag
	 */
	removeTag(tag: any)
	{
		ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
		this.tags.delete(tag);
	}

	/**
	 * Adds a component to this actor.
	 * @param component
	 * @returns `true` if the component was successfully added, `false` otherwise.
	 */
	addComponent(component: Component): boolean
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
	removeComponent(component: Component): boolean
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
	stealComponent(component: Component): boolean
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
	giveComponent(component: Component, newParent: Actor): boolean
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
		component._onStart();
		component._onEnterScene();
		return true;
	}

	/**
	 * Gets all components of a certain type directly attached to this actor.
	 */
	getComponentsByType<T extends Component>(type: Constructor<T>): SparseSet<T>
	{
		return (this.#componentsByType.get(type) as SparseSet<T>) ?? new SparseSet<T>;
	}

	/**
	 * Gets all components with a certain tag directly attached to this actor.
	 */
	getComponentsByTag(tag: any): SparseSet<Component>
	{
		return this.#componentsByTag.get(tag) ?? new SparseSet;
	}

	/**
	 * Destroys this actor and all its components.
	 */
	destructor()
	{
		if(this.#destroyed)
		{
			ELYSIA_LOGGER.warn("Actor already destroyed");
			return;
		}
		this.scene?.removeComponent(this);
		this._onDestroy();
	}

	/* **********************************************************
	    Internal methods
	************************************************************/

	/** @internal */ _onEnable(){
		this.#enabled = true;
		this.object3d.visible = true;
		this.onEnable();
	}

	/** @internal */ _onDisable() {
		this.#enabled = false;
		this.object3d.visible = false;
		this.onDisable();
	}

	/** @internal */ _onCreate() {
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

	/** @internal */ _onStart() {
		if(this.#started) return;
		if(this.#destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to start a destroyed actor: ${this}`);
			return;
		}
		if(!this.#created)
		{
			ELYSIA_LOGGER.warn(`Trying to start an actor that was not created. This is most likely a bug, please report it.`);
			return;
		}
		this.#started = true;
		this.onStart();
		for(const component of this.components)
		{
			component._onStart();
		}
	}

	/** @internal */ _onEnterScene() {
		if(this.#inScene) return;
		if(this.destroyed)
		{
			ELYSIA_LOGGER.warn(`Trying to add a destroyed actor to scene: ${this}`);
			return;
		}
		if(!this.#started)
		{
			ELYSIA_LOGGER.warn(`Trying to enter a scene an actor that was not started. This is most likely a bug, please report it.`);
			return;
		}
		this.#inScene = true;
		this.onEnterScene();
		for(const component of this.components)
		{
			component._onEnterScene();
		}
	}

	/** @internal */ _onBeforePhysicsUpdate(delta: number, elapsed: number)
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

	/** @internal */ _onUpdate(delta: number, elapsed: number)
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

	/** @internal */ _onLeaveScene()
	{
		if(!this.#inScene) return;
		this.#inScene = false;
		this.onLeaveScene();
		for(const component of this.components)
		{
			component._onLeaveScene();
		}
	}

	/** @internal */ _onDestroy()
	{
		if(this.#destroyed) return;
		this.#destroyed = true;
		this.#object3d.actor = undefined;
		this.#object3d.parent?.remove(this.#object3d);
		this.onDestroy();
		this._onDisable();
		this._onLeaveScene();
		for(const component of this.components)
		{
			component._onDestroy();
		}
	}

	/** @internal */ _onReparent(newParent: Actor | null) {
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

	#object3d: T = new Three.Object3D as T;
	#created: boolean = false;
	#started: boolean = false;
	#enabled: boolean = true;
	#inScene: boolean = false;
	#destroyed: boolean = false;
	#componentsByType = new Map<Constructor<Component>, SparseSet<Component>>;
	#componentsByTag = new Map<any, SparseSet<Component>>;
}