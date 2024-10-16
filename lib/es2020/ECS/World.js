var _a, _b;
import * as Internal from "./Internal.js";
export class World {
    constructor(systems = []) {
        Object.defineProperty(this, "systems", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: systems
        });
        Object.defineProperty(this, _a, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, _b, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    addSystem(system) {
        const instance = new system(this);
        this.systems.push(instance);
        return instance;
    }
    removeSystem(system) {
        const index = this.systems.indexOf(system);
        if (index !== -1)
            this.systems.splice(index, 1);
    }
    addEntity(entity) {
        const instance = new entity();
        for (const system of this.systems) {
            if (system.active)
                system[Internal.onEntityAdded](instance);
        }
    }
    removeEntity(entity) {
        for (const system of this.systems) {
            if (system.active)
                system[Internal.onEntityRemoved](entity);
        }
    }
    addComponent(entity, component) {
        for (const system of this.systems) {
            if (system.active)
                system[Internal.onComponentAdded](entity, component);
        }
    }
    removeComponent(entity, component) {
        for (const system of this.systems) {
            if (system.active)
                system[Internal.onComponentRemoved](entity, component);
        }
    }
    start() {
        if (this[Internal.isActive])
            return;
        this[Internal.isActive] = true;
        for (const system of this.systems) {
            if (!system.active && !system.destroyed) {
                system[Internal.isActive] = true;
                system[Internal.onStart]();
            }
        }
    }
    update(delta, elapsed) {
        if (!this[Internal.isActive] || this[Internal.isDestroyed])
            return;
        for (const system of this.systems) {
            // need to match queries here
            if (system.active)
                system[Internal.onUpdate](delta, elapsed);
        }
    }
    stop() {
        if (!this[Internal.isActive] || this[Internal.isDestroyed])
            return;
        this[Internal.isActive] = false;
        for (const system of this.systems) {
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
        for (const system of this.systems) {
            system.destructor();
        }
    }
}
_a = Internal.isActive, _b = Internal.isDestroyed;
