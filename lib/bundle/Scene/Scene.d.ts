import { Actor } from "./Actor.ts";
import * as Three from "three";
import { Destroyable, SceneLifecycle } from "../Core/Lifecycle.ts";
import { Future } from "../Containers/Future.ts";
import { Constructor } from "../Core/Utilities.ts";
import { Behavior } from "./Behavior.ts";
import { Component } from "./Component.ts";
import { GridActor } from "../Actors/GridActor.ts";
import { SparseSet } from "../Containers/SparseSet.ts";
import { PhysicsController } from "../Physics/PhysicsController.ts";
import { ActiveCamera, OnLoad, SceneLoadPromise } from "../Core/Internal.ts";
export declare const IsScene: unique symbol;
export declare class Scene extends Actor<Three.Scene> implements SceneLifecycle, Destroyable {
    #private;
    [IsScene]: boolean;
    type: string;
    physics?: PhysicsController;
    get grid(): GridActor;
    get ambientLight(): Three.AmbientLight;
    get activeCamera(): Three.Camera | Actor<Three.Camera>;
    set activeCamera(camera: Three.Camera | Actor<Three.Camera>);
    constructor();
    /**
     * Returns all actors in the scene with the given tag.
     * @param tag
     */
    getComponentsByTag(tag: any): SparseSet<Component>;
    /**
     * Returns all actors in the scene with the given type.
     */
    getComponentsByType<T extends Actor | Behavior>(type: Constructor<T>): SparseSet<T>;
    /**
     * Returns the active camera in the scene (if one is set via ActiveCameraTag).
     * If multiple cameras are set as active, the first one found is returned.
     */
    getActiveCamera(): Three.Camera;
    onLoad(): void | Promise<void>;
    onCreate(): void;
    onStart(): void;
    onUpdate(delta: number, elapsed: number): void;
    onEnd(): void;
    [OnLoad](): Promise<void>;
    [SceneLoadPromise]: Future<void>;
    [ActiveCamera]: Three.Camera;
}
