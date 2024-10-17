import { Actor } from "./Actor.js";
import * as Three from "three";
import { Future } from "../Containers/Future.js";
import { bound, noop } from "../Core/Utilities.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent, TagRemovedEvent } from "../Core/ElysiaEvents.js";
import { isActor } from "./Component.js";
import { GridActor } from "../Actors/GridActor.js";
import { ComponentSet } from "../Containers/ComponentSet.js";
import { ActiveCamera, App, Internal, OnBeforePhysicsUpdate, OnCreate, OnDestroy, OnLoad, OnStart, OnUpdate, SceneLoadPromise } from "../Core/Internal.js";
export const Root = Symbol.for("Elysia::Scene::Root");
export const IsScene = Symbol.for("Elysia::IsScene");
export class Scene {
    [IsScene] = true;
    type = "Scene";
    physics;
    /** Get the root Three.Scene */
    get object3d() { return this[Root].object3d; }
    /** Get the owning Application */
    get app() { return this[App]; }
    /** Get the scene grid actor */
    get grid() { return this.#grid; }
    /** Get the scene's ambient light */
    get ambientLight() { return this.#ambientLight; }
    /** The scene's active camera */
    get activeCamera() { return this.getActiveCamera(); }
    set activeCamera(camera) {
        this[ActiveCamera] = camera instanceof Actor ? camera.object3d : camera;
        this[App]?.renderPipeline.onCameraChange(this[ActiveCamera]);
    }
    constructor() {
        ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {
            const type = e.child.constructor;
            if (!this.#componentsByType.has(type))
                this.#componentsByType.set(type, new ComponentSet);
            this.#componentsByType.get(type).add(e.child);
            if (isActor(e.child)) {
                this.#allActors.add(e.child);
            }
            else {
                this.#allBehaviors.add(e.child);
            }
        });
        ElysiaEventDispatcher.addEventListener(ComponentRemovedEvent, (e) => {
            const type = e.child.constructor;
            this.#componentsByType.get(type)?.delete(e.child);
            if (isActor(e.child)) {
                this.#allActors.delete(e.child);
            }
            else {
                this.#allBehaviors.delete(e.child);
            }
            for (const tag of e.child.tags) {
                this.#componentsByTag.get(tag)?.delete(e.child);
            }
        });
        ElysiaEventDispatcher.addEventListener(TagAddedEvent, (event) => {
            if (!this.#componentsByTag.has(event.tag))
                this.#componentsByTag.set(event.tag, new ComponentSet);
            this.#componentsByTag.get(event.tag).add(event.target);
        });
        ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
            this.#componentsByTag.get(event.tag)?.delete(event.target);
        });
    }
    /**
     * Adds a component to this scene.
     * @param component
     */
    @bound
    addComponent(...components) {
        for (const c of components) {
            this[Root].addComponent(c);
        }
        return this;
    }
    /**
     * Removes a component to this scene.
     * @param component
     * @returns `true` if the component was successfully added, `false` otherwise.
     */
    @bound
    removeComponent(...components) {
        for (const c of components) {
            this[Root].removeComponent(c);
        }
        return this;
    }
    /**
     * Returns all actors in the scene with the given tag.
     * @param tag
     */
    @bound
    getComponentsByTag(tag) {
        const set = this.#componentsByTag.get(tag);
        if (!set) {
            const newSet = new ComponentSet();
            this.#componentsByTag.set(tag, newSet);
            return newSet;
        }
        else
            return set;
    }
    /**
     * Returns all actors in the scene with the given type.
     */
    @bound
    getComponentsByType(type) {
        const set = this.#componentsByType.get(type);
        if (!set) {
            const newSet = new ComponentSet();
            this.#componentsByType.set(type, newSet);
            return newSet;
        }
        else
            return set;
    }
    /**
     * Returns the active camera in the scene (if one is set via ActiveCameraTag).
     * If multiple cameras are set as active, the first one found is returned.
     */
    @bound
    getActiveCamera() { return this[ActiveCamera]; }
    onLoad() { }
    onCreate() { }
    onStart() { }
    onBeforePhysicsUpdate(delta, elapsed) { }
    onUpdate(delta, elapsed) { }
    onDestroy() { }
    destructor() {
        this[OnDestroy]();
    }
    @bound
    async [OnLoad]() {
        if (this[Internal].loaded || this[Internal].destroyed)
            return;
        await Promise.all([this.onLoad(), this.physics?.init(this) ?? Promise.resolve()]);
        this[Internal].loaded = true;
        this[SceneLoadPromise].resolve();
    }
    @bound
    [OnCreate]() {
        if (this[Internal].created || !this[Internal].loaded || this[Internal].destroyed)
            return;
        this.object3d.add(this.#ambientLight);
        this.addComponent(this.#grid);
        this.grid.disable();
        this.onCreate();
        this[Root][Internal].app = this[App];
        this[Root][Internal].scene = this;
        this[Root][Internal].parent = null;
        this[Internal].created = true;
        this[Root][OnCreate]();
    }
    @bound
    [OnStart]() {
        if (this[Internal].started || !this[Internal].created || this[Internal].destroyed)
            return;
        this.physics?.start();
        this.onStart();
        this[Internal].started = true;
        this[Root][OnStart]();
    }
    @bound
    [OnBeforePhysicsUpdate](delta, elapsed) {
        if (this[Internal].destroyed)
            return;
        if (!this[Internal].started)
            this[OnStart]();
        this.onBeforePhysicsUpdate(delta, elapsed);
        this[Root][OnBeforePhysicsUpdate](delta, elapsed);
    }
    @bound
    [OnUpdate](delta, elapsed) {
        if (this[Internal].destroyed)
            return;
        if (!this[Internal].started)
            this[OnStart]();
        this.physics?.updatePhysicsWorld(this, delta, elapsed);
        this.onUpdate(delta, elapsed);
        this[Root][OnUpdate](delta, elapsed);
    }
    @bound
    [OnDestroy]() {
        if (this[Internal].destroyed)
            return;
        this[Root].destructor();
        this.onDestroy();
        this.#grid.destructor();
        this.ambientLight.dispose();
        this.#componentsByTag.clear();
        this.#componentsByType.clear();
        this[App] = null;
        this[Internal].destroyed = true;
    }
    [SceneLoadPromise] = new Future(noop);
    [ActiveCamera] = new Three.PerspectiveCamera();
    [Root] = new SceneActor;
    [App] = null;
    [Internal] = {
        loaded: false,
        created: false,
        started: false,
        destroyed: false,
    };
    #grid = new GridActor;
    #ambientLight = new Three.AmbientLight(0xffffff, 1);
    #componentsByTag = new Map;
    #componentsByType = new Map;
    #allActors = new ComponentSet;
    #allBehaviors = new ComponentSet;
}
export class SceneActor extends Actor {
    constructor() {
        super();
        this.object3d = new Three.Scene;
    }
    onCreate() {
        console.log("huh?", this.object3d);
    }
}
