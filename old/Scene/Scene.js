import * as Three from "three";
import { SceneActor } from "../Actors/SceneActor";
import { ActiveCameraTag } from "../Core/Tags";
import { PointerIntersections } from "./PointerIntersection";
export class Scene {
    app;
    root = new SceneActor;
    getPointerIntersections() { return this.pointer.intersections; }
    constructor(app) {
        this.app = app;
        this.root.app = app;
        this.root.scene = this;
    }
    async init() {
        // handle initialization of scene
    }
    onPlay() {
        // handle onPlay
        this.root.onCreate();
        this.root.onSpawn();
    }
    onUpdate(delta, elapsed) {
        this.pointer.cast(this.app.getPointerPosition(), this.getActiveCamera()?.getComponent(Three.Camera), this.root);
        this.root.onUpdate(delta, elapsed);
    }
    destructor() {
        // handle destruction of scene
        this.destroyed = true;
        for (const destroyable of this.destroyables)
            destroyable();
        this.root.despawn();
        this.root.destroy();
    }
    findByTag(tag) {
        return this.tagCollections.get(tag) ?? new Set;
    }
    findById(id) {
        return this.idCollection.get(id);
    }
    getActiveCamera() {
        return this.findByTag(ActiveCameraTag).values().next().value;
    }
    setActiveCamera(actor) {
        const current = this.getActiveCamera();
        if (current) {
            current.removeTag(ActiveCameraTag);
        }
        actor.addTag(ActiveCameraTag);
    }
    destroyOnUnload(...fn) {
        for (const f of fn)
            this.destroyables.add(f);
    }
    tagCollections = new Map;
    idCollection = new Map;
    pointer = new PointerIntersections;
    destroyed = false;
    destroyables = new Set();
}
