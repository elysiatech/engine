var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _World_systems, _World_entityCount, _a, _b;
import * as Internal from "./Internal.js";
export class World {
    get active() { return this[Internal.isActive] && !this[Internal.isDestroyed]; }
    get destroyed() { return this[Internal.isDestroyed]; }
    constructor(systems = []) {
        _World_systems.set(this, new Set);
        _World_entityCount.set(this, 0);
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
        for (const system of systems)
            __classPrivateFieldGet(this, _World_systems, "f").add(system);
    }
    addSystem(system) {
        const instance = new system(this);
        __classPrivateFieldGet(this, _World_systems, "f").add(instance);
        if (this.active)
            instance[Internal.onStart]();
        return instance;
    }
    removeSystem(system) {
        __classPrivateFieldGet(this, _World_systems, "f").delete(system);
        system.destructor();
    }
    addEntity() {
        var _c, _d;
        const entity = (__classPrivateFieldSet(this, _World_entityCount, (_d = __classPrivateFieldGet(this, _World_entityCount, "f"), _c = _d++, _d), "f"), _c);
        for (const system of __classPrivateFieldGet(this, _World_systems, "f")) {
            if (system.active)
                system[Internal.onEntityAdded](entity);
        }
        return entity;
    }
    removeEntity(entity) {
        for (const system of __classPrivateFieldGet(this, _World_systems, "f")) {
            if (system.active)
                system[Internal.onEntityRemoved](entity);
        }
    }
    addComponent(entity, component) {
        for (const system of __classPrivateFieldGet(this, _World_systems, "f")) {
            if (system.active)
                system[Internal.onComponentAdded](entity, component);
        }
    }
    removeComponent(entity, component) {
        for (const system of __classPrivateFieldGet(this, _World_systems, "f")) {
            if (system.active)
                system[Internal.onComponentRemoved](entity, component);
        }
    }
    start() {
        if (this[Internal.isActive])
            return;
        this[Internal.isActive] = true;
        for (const system of __classPrivateFieldGet(this, _World_systems, "f")) {
            if (!system.active && !system.destroyed) {
                system[Internal.isActive] = true;
                system[Internal.onStart]();
            }
        }
    }
    update(delta, elapsed) {
        if (!this[Internal.isActive] || this[Internal.isDestroyed])
            return;
        for (const system of __classPrivateFieldGet(this, _World_systems, "f")) {
            // need to match queries here
            if (system.active)
                system[Internal.onUpdate](delta, elapsed);
        }
    }
    stop() {
        if (!this[Internal.isActive] || this[Internal.isDestroyed])
            return;
        this[Internal.isActive] = false;
        for (const system of __classPrivateFieldGet(this, _World_systems, "f")) {
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
        for (const system of __classPrivateFieldGet(this, _World_systems, "f")) {
            system.destructor();
        }
    }
}
_World_systems = new WeakMap(), _World_entityCount = new WeakMap(), _a = Internal.isActive, _b = Internal.isDestroyed;
