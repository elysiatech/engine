import * as Three from "three";
import { isActor, isBehavior } from "../Core/Assert";
import { destroyObject3D } from "../Utils/DestroyObject3D";
export class Actor {
    get isActor() { return true; }
    id;
    tags = new Set();
    object3d;
    parent = null;
    scene = null;
    app = null;
    get position() { return this.object3d.position; }
    get rotation() { return this.object3d.rotation; }
    get scale() { return this.object3d.scale; }
    get quaternion() { return this.object3d.quaternion; }
    get matrix() { return this.object3d.matrix; }
    get visible() { return this.object3d.visible; }
    set visible(value) { this.object3d.visible = value; }
    components = new Set();
    initialized = false;
    spawned = false;
    destroyed = false;
    constructor() {
        this.object3d = new Three.Object3D();
        this.object3d.userData.owner = this;
    }
    addComponent(component) {
        if (this.destroyed)
            return this;
        if (isActor(component.parent)) {
            component.parent.removeComponent(component);
        }
        this.components.add(component);
        component.parent = this;
        component.scene = this.scene;
        if (isActor(component)) {
            this.object3d.add(component.object3d);
            if (component.id) {
                // handle id in scene
            }
            if (component.tags) {
                // handle tags in scene
            }
        }
        if (isBehavior(component)) {
            if (component.id) {
                // handle id in scene
            }
            if (component.tags) {
                for (const tag of component.tags) {
                    // handle tags in scene
                }
            }
        }
        if (this.initialized) {
            component.create();
        }
        if (this.spawned) {
            component.spawn();
        }
        return this;
    }
    removeComponent(component) {
        if (this.destroyed)
            return component;
        component.parent = null;
        this.components.delete(component);
        if (isActor(component)) {
            this.object3d.remove(component.object3d);
            if (component.id) {
                // handle scene id
            }
            if (component.tags) {
                for (const tag of component.tags) {
                    // handle scene tags
                }
            }
        }
        return component;
    }
    addTag(tag) {
        this.tags.add(tag);
        // handle scene tags
        return this;
    }
    removeTag(tag) {
        this.tags.delete(tag);
        // handle scene tags
        return this;
    }
    create() {
        if (this.initialized || this.destroyed || !this.scene || !this.scene.app)
            return;
        this.object3d.userData.owner = this;
        this.onCreate();
        this.initialized = true;
        for (const component of this.components) {
            component.scene = this.scene;
            component.create();
        }
    }
    spawn() {
        if (this.spawned || this.destroyed)
            return;
        this.onSpawn();
        this.spawned = true;
        this.parent?.object3d.add(this.object3d);
        for (const component of this.components) {
            component.spawn();
        }
    }
    update(frametime, elapsedtime) {
        if (!this.spawned || this.destroyed)
            return;
        this.onUpdate(frametime, elapsedtime);
        for (const component of this.components) {
            component.update(frametime, elapsedtime);
        }
    }
    despawn() {
        if (!this.spawned || this.destroyed)
            return;
        this.onDespawn();
        this.parent?.object3d.remove(this.object3d);
        for (const component of this.components) {
            component.despawn();
        }
    }
    destroy() {
        if (this.destroyed)
            return;
        this.destructor();
        this.destroyed = true;
        destroyObject3D(this.object3d);
        for (const component of this.components) {
            component.despawn();
            component.destroy();
        }
    }
    resize(bounds) {
        if (!this.initialized || this.destroyed)
            return;
        this.onResize(bounds);
        for (const component of this.components) {
            component.resize(bounds);
        }
    }
    onCreate() { }
    onSpawn() { }
    onUpdate(frametime, elapsedtime) { }
    onDespawn() { }
    onResize(bounds) { }
    destructor() {
        this.disposables.forEach((fn) => fn());
        for (const component of this.components) {
            component.destroy();
        }
        this.components.clear();
        this.scene = null;
        this.parent = null;
        this.initialized = false;
        this.spawned = false;
        this.destroyed = true;
        this.tags.clear();
        this.disposables.forEach((fn) => fn());
        this.disposables.length = 0;
    }
    dispose(...callbacks) {
        this.disposables.push(...callbacks);
    }
    *componentIterator() {
        for (const component of this.components) {
            yield component;
        }
    }
    getComponentsByTag(tag) {
        // todo: make readonly
        if (!this.tagSetCache.has(tag)) {
            this.tagSetCache.set(tag, new Set());
        }
        const container = this.tagSetCache.get(tag);
        container.clear();
        for (const component of this.components) {
            if (component.tags.has(tag)) {
                container.add(component);
            }
        }
        return container;
    }
    getComponents(type) {
        if (!this.typeSetCache.has(type)) {
            this.typeSetCache.set(type, new Set());
        }
        const container = this.typeSetCache.get(type);
        container.clear();
        for (const component of this.components) {
            if (component instanceof type) {
                container.add(component);
            }
        }
        return container;
    }
    tagSetCache = new Map;
    typeSetCache = new Map;
    disposables = [];
}
