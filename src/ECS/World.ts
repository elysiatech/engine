import { System } from "./System.ts";
import { Constructor } from "../Core/Utilities.ts"
import * as Internal from "./Internal.ts";
import { Entity } from "./Entity.ts";
import { Component } from "./Component.ts";
import { Destroyable } from "../Core/Lifecycle.ts";

export class World implements Destroyable
{
	constructor(
		private readonly systems: System[] = []
	){}

	public addSystem<T extends System>(system: Constructor<T>): T
	{
		const instance = new system(this);
		this.systems.push(instance);
		return instance;
	}

	public removeSystem<T extends System>(system: T)
	{
		const index = this.systems.indexOf(system);
		if (index !== -1) this.systems.splice(index, 1);
	}

	addEntity(entity: Constructor<Entity>)
	{
		const instance = new entity();
		for (const system of this.systems)
		{
			if (system.active)
				system[Internal.onEntityAdded](instance);
		}
	}

	removeEntity(entity: Entity)
	{
		for (const system of this.systems)
		{
			if (system.active)
				system[Internal.onEntityRemoved](entity);
		}
	}

	addComponent(entity: Entity, component: Component)
	{
		for (const system of this.systems)
		{
			if (system.active)
				system[Internal.onComponentAdded](entity, component);
		}
	}

	removeComponent(entity: Entity, component: Component)
	{
		for (const system of this.systems)
		{
			if (system.active)
				system[Internal.onComponentRemoved](entity, component);
		}
	}

	public start()
	{
		if (this[Internal.isActive]) return;
		this[Internal.isActive] = true;
		for (const system of this.systems)
		{
			if(!system.active && !system.destroyed)
			{
				system[Internal.isActive] = true;
				system[Internal.onStart]();
			}
		}
	}

	public update(delta: number, elapsed: number)
	{
		if (!this[Internal.isActive] || this[Internal.isDestroyed]) return;
		for (const system of this.systems)
		{
			// need to match queries here
			if(system.active)
				system[Internal.onUpdate](delta, elapsed);
		}
	}

	public stop()
	{
		if (!this[Internal.isActive] || this[Internal.isDestroyed]) return;
		this[Internal.isActive] = false;
		for (const system of this.systems)
		{
			if(system.active)
			{
				system[Internal.isActive] = false;
				system[Internal.onStop]();
			}
		}
	}

	public destructor(): void {
		if (this[Internal.isDestroyed]) return;
		this[Internal.isDestroyed] = true;
		this[Internal.isActive] = false;
		for (const system of this.systems)
		{
			system.destructor();
		}
	}

	[Internal.isActive] = false;

	[Internal.isDestroyed] = false;
}
