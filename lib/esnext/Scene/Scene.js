import { Actor } from "./Actor.js";
import * as Three from "three";
import { Future } from "../Containers/Future.js";
import { bound, noop } from "../Core/Utilities.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ComponentAddedEvent, ComponentRemovedEvent, TagAddedEvent, TagRemovedEvent } from "../Core/ElysiaEvents.js";
import { isActor } from "./Component.js";
import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { GridActor } from "../Actors/GridActor.js";
import { SparseSet } from "../Containers/SparseSet.js";
import { ActiveCamera, Internal, OnLoad, SceneLoadPromise } from "../Core/Internal.js";
export const IsScene = Symbol.for("Elysia::IsScene");
export class Scene extends Actor {
    [IsScene] = true;
    type = "Scene";
    physics;
    get grid() { return this.#grid; }
    get ambientLight() { return this.#ambientLight; }
    get activeCamera() { return this.getActiveCamera(); }
    set activeCamera(camera) {
        this[ActiveCamera] = camera instanceof Actor ? camera.object3d : camera;
        this.app?.renderPipeline.onCameraChange(this[ActiveCamera]);
    }
    constructor() {
        super();
        this.object3d = this[Internal].object3d = new Three.Scene();
        this[Internal].scene = this;
        ElysiaEventDispatcher.addEventListener(ComponentAddedEvent, (e) => {
            const type = e.child.constructor;
            if (!this.#componentsByType.has(type))
                this.#componentsByType.set(type, new SparseSet);
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
        });
        ElysiaEventDispatcher.addEventListener(TagAddedEvent, (event) => {
            if (!this.#componentsByTag.has(event.tag))
                this.#componentsByTag.set(event.tag, new SparseSet);
            this.#componentsByTag.get(event.tag).add(event.target);
        });
        ElysiaEventDispatcher.addEventListener(TagRemovedEvent, (event) => {
            this.#componentsByTag.get(event.tag)?.delete(event.target);
        });
    }
    /**
     * Returns all actors in the scene with the given tag.
     * @param tag
     */
    @bound
    getComponentsByTag(tag) {
        return this.#componentsByTag.get(tag) || new SparseSet;
    }
    /**
     * Returns all actors in the scene with the given type.
     */
    @bound
    getComponentsByType(type) {
        return this.#componentsByType.get(type) || new SparseSet;
    }
    /**
     * Returns the active camera in the scene (if one is set via ActiveCameraTag).
     * If multiple cameras are set as active, the first one found is returned.
     */
    @bound
    getActiveCamera() {
        return this[ActiveCamera];
    }
    @bound
    onLoad() { }
    @bound
    onCreate() {
        ELYSIA_LOGGER.debug("Scene created", this);
        this.object3d.add(this.#ambientLight);
        this.#grid.disable();
        this.addComponent(this.#grid);
    }
    @bound
    onStart() {
        super.onStart();
        this.physics?.start();
    }
    @bound
    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);
        const t = performance.now();
        this.physics?.updatePhysicsWorld(this, delta, elapsed);
        // console.log("Physics update time", performance.now() - t)
    }
    @bound
    onEnd() {
        this.#componentsByTag.clear();
        this.#componentsByType.clear();
    }
    @bound
    async [OnLoad]() {
        await Promise.all([this.onLoad(), this.physics?.init(this) ?? Promise.resolve()]);
        this[SceneLoadPromise].resolve();
    }
    [SceneLoadPromise] = new Future(noop);
    [ActiveCamera] = new Three.PerspectiveCamera();
    #grid = new GridActor;
    #ambientLight = new Three.AmbientLight(0xffffff, 0.5);
    #componentsByTag = new Map;
    #componentsByType = new Map;
    #allActors = new SparseSet;
    #allBehaviors = new SparseSet;
}
