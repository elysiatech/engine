import { System } from "./System.ts";
import { Constructor } from "../Core/Utilities.ts";
import * as Internal from "./Internal.ts";
import { Entity } from "./Entity.ts";
import { Component } from "./Component.ts";
import { Destroyable } from "../Core/Lifecycle.ts";
export declare class World implements Destroyable {
    #private;
    get active(): boolean;
    get destroyed(): boolean;
    constructor(systems?: System[]);
    addSystem<T extends System>(system: Constructor<T>): T;
    removeSystem<T extends System>(system: T): void;
    addEntity(): Entity;
    removeEntity(entity: Entity): void;
    addComponent(entity: Entity, component: Component): void;
    removeComponent(entity: Entity, component: Component): void;
    start(): void;
    update(delta: number, elapsed: number): void;
    stop(): void;
    destructor(): void;
    [Internal.isActive]: boolean;
    [Internal.isDestroyed]: boolean;
}
