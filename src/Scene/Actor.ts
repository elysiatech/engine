import * as Three from "three";
import { ActorLifecycle, Destroyable } from "../Core/Lifecycle";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent } from "../Core/ElysiaEvents";
import { Component } from "./Component";

declare module 'three'
{
	export interface Object3D
	{
		actor?: Actor<any>;
	}
}

export class Actor<T extends Three.Object3D = Three.Object3D> implements ActorLifecycle, Destroyable
{
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

	get destroyed() { return this.#destroyed; }

	parent: Actor<any> | null = null;

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

	onUpdate(delta: number, elapsed: number) {}

	onLeaveScene() {}

	onDisable() {}

	onDestroy() {}

	onReparent(parent: Actor | null) {}

	/* **********************************************************
	    Public methods
	************************************************************/

	enable() { this._enable(); }

	disable() { this._disable(); }

	addTag(tag: any)
	{
		ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
		this.tags.add(tag);
	}

	removeTag(tag: any)
	{
		ElysiaEventDispatcher.dispatchEvent(new TagAddedEvent({ tag, target: this }));
		this.tags.delete(tag);
	}

	addComponent(component: Component): Component
	{
		if(this.destroyed)
		{
			return component;
		}
		this.components.add(component);
		component._reparent(this);
		ElysiaEventDispatcher.dispatchEvent(new ComponentAddedEvent({ parent: this, child: component }));
		if(this.#created)
		{
			component._create();
		}
		if(this.#enabled)
		{
			component._enable();
			if(this.#started)
			{
				component._start();
			}
		}
		return component;
	}

	removeComponent(component: Component): Component
	{
		if(this.destroyed)
		{
			return component;
		}
		this.components.delete(component);
		ElysiaEventDispatcher.dispatchEvent(new ComponentRemovedEvent({ parent: this, child: component }));
		component.parent = null;
		component._reparent(null);
		component._disable();
		return component;
	}

	destructor()
	{
		if(this.#destroyed)
		{
			ELYSIA_LOGGER.warn("Actor already destroyed");
			return;
		}
		this.#destroyed = true;
		this.#object3d.actor = undefined;
		this.#object3d.parent?.remove(this.#object3d);
		this.disable();
		for(const component of this.components)
		{
			component.destructor();
		}
	}

	/* **********************************************************
	    Internal methods
	************************************************************/

	/** @internal */ _enable()
	{
		if(this.enabled || this.#destroyed)
		{
			return;
		}
		this.#enabled = true;
		this.#object3d.visible = true;
		this.onEnable();
		for(const component of this.components)
		{
			if(component._enable) component._enable();
		}
		if(this.#created)
		{
			for(const component of this.components)
			{
				if(component._create) component._create();
			}
		}
		if(this.#started)
		{
			for (const component of this.components)
			{
				if (component._start) component._start();
			}
		}
	}

	/** @internal */ _disable()
	{
		if(!this.enabled || this.#destroyed)
		{
			return;
		}
		this.#enabled = false;
		this.#object3d.visible = false;
		this.onDisable();
		for(const component of this.components)
		{
			if(component._disable) component._disable();
		}
	}

	/** @internal */ _create()
	{
		if(this.#created || this.#destroyed)
		{
			return;
		}
		this.#created = true;
		this.onCreate();
		for(const component of this.components)
		{
			component._create();
		}
	}

	/** @internal */ _start()
	{
		if(!this.#enabled || !this.#created || this.#started || this.#destroyed)
		{
			return;
		}
		this.#started = true;
		this.onStart();
		for(const component of this.components)
		{
			component._start();
		}
	}

	/** @internal */ _update(delta: number, elapsed: number)
	{
		if(!this.#enabled || !this.#started || this.#destroyed)
		{
			return;
		}
		this.onUpdate(delta, elapsed);
		for(const component of this.components)
		{
			component._update(delta, elapsed);
		}
	}

	/** @internal */ _reparent(newParent: Actor | null)
	{
		if(this.#destroyed)
		{
			ELYSIA_LOGGER.warn("Actor already destroyed");
			return;
		}
		if(this.parent === newParent)
		{
			ELYSIA_LOGGER.warn("Actor already parented to parent");
			return;
		}
		if(this.parent)
		{
			this.parent.#object3d.remove(this.#object3d);
		}
		this.parent = newParent;
		this.parent?.object3d.add(this.#object3d);
		this.onReparent(newParent);
	}

	#object3d: T = new Three.Object3D as T;
	#created: boolean = false;
	#started: boolean = false;
	#enabled: boolean = true;
	#destroyed: boolean = false;
}