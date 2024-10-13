import { Actor } from "./Actor";
import * as Three from "three";
import { Destroyable, SceneLifecycle } from "../Core/Lifecycle";
import { Constructor } from "../Core/Utilities";
import { Behavior } from "./Behavior";
import { Component } from "./Component";
import { SparseSet } from "../Containers/SparseSet";
import { PhysicsController } from "../Physics/PhysicsController";
export declare const IsScene: unique symbol;
export declare class Scene extends Actor<Three.Scene> implements SceneLifecycle, Destroyable {
    #private;
    [x: number]: any;
    [IsScene]: boolean;
    type: string;
    physics?: PhysicsController;
    get grid(): any;
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
}
