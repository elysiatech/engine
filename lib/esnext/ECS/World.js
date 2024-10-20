import * as Internal from "./Internal.js";
export class World {
    get active() { return this[Internal.isActive] && !this[Internal.isDestroyed]; }
    get destroyed() { return this[Internal.isDestroyed]; }
    constructor() {
    }
    addSystem(system) {
        const instance = new system(this);
        this.#systems.add(instance);
        if (this.active)
            instance[Internal.onStart]();
        return instance;
    }
    removeSystem(system) {
        this.#systems.delete(system);
        system.destructor();
    }
    addEntity() {
        const entity = this.#entityCount++;
        for (const system of this.#systems) {
            if (system.active)
                system[Internal.onEntityAdded](entity);
        }
        return entity;
    }
    removeEntity(entity) {
        for (const system of this.#systems) {
            if (system.active)
                system[Internal.onEntityRemoved](entity);
        }
    }
    addComponent(entity, component) {
        for (const system of this.#systems) {
            if (system.active)
                system[Internal.onComponentAdded](entity, component);
        }
    }
    removeComponent(entity, component) {
        for (const system of this.#systems) {
            if (system.active)
                system[Internal.onComponentRemoved](entity, component);
        }
    }
    start() {
        if (this[Internal.isActive])
            return;
        this[Internal.isActive] = true;
        for (const system of this.#systems) {
            if (!system.active && !system.destroyed) {
                system[Internal.isActive] = true;
                system[Internal.onStart]();
            }
        }
    }
    update(delta, elapsed) {
        if (!this[Internal.isActive] || this[Internal.isDestroyed])
            return;
        for (const system of this.#systems) {
            // need to match queries here
            if (system.active)
                system[Internal.onUpdate](delta, elapsed);
        }
    }
    stop() {
        if (!this[Internal.isActive] || this[Internal.isDestroyed])
            return;
        this[Internal.isActive] = false;
        for (const system of this.#systems) {
            if (system.active) {
                system[Internal.isActive] = false;
                system[Internal.onStop]();
            }
        }
    }
    destructor() {
        if (this[Internal.isDestroyed])
            return;
        this[Internal.isDestroyed] = true;
        this[Internal.isActive] = false;
        for (const system of this.#systems) {
            system.destructor();
        }
    }
    #systems = new Set;
    #entityCount = 0;
    [Internal.isActive] = false;
    [Internal.isDestroyed] = false;
}
