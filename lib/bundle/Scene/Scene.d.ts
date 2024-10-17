import { Actor } from "./Actor.ts";
import * as Three from "three";
import { Destroyable } from "../Core/Lifecycle.ts";
import { Future } from "../Containers/Future.ts";
import { Constructor } from "../Core/Utilities.ts";
import { Behavior } from "./Behavior.ts";
import { Component } from "./Component.ts";
import { GridActor } from "../Actors/GridActor.ts";
import { ComponentSet } from "../Containers/ComponentSet.ts";
import { PhysicsController } from "../Physics/PhysicsController.ts";
import { ActiveCamera, App, Internal, OnBeforePhysicsUpdate, OnCreate, OnDestroy, OnLoad, OnStart, OnUpdate, SceneLoadPromise } from "../Core/Internal.ts";
import { Application } from "../Core/ApplicationEntry.ts";
export declare const Root: unique symbol;
export declare const IsScene: unique symbol;
export declare class Scene implements Destroyable {
    #private;
    [IsScene]: boolean;
    readonly type = "Scene";
    physics?: PhysicsController;
    /** Get the root Three.Scene */
    get object3d(): Three.Scene;
    /** Get the owning Application */
    get app(): Application | null;
    /** Get the scene grid actor */
    get grid(): GridActor;
    /** Get the scene's ambient light */
    get ambientLight(): Three.AmbientLight;
    /** The scene's active camera */
    get activeCamera(): Three.Camera | Actor<Three.Camera>;
    set activeCamera(camera: Three.Camera | Actor<Three.Camera>);
    constructor();
    /**
     * Adds a component to this scene.
     * @param component
     */
    addComponent(...components: Component[]): this;
    /**
     * Removes a component to this scene.
     * @param component
     * @returns `true` if the component was successfully added, `false` otherwise.
     */
    removeComponent(...components: Component[]): this;
    /**
     * Returns all actors in the scene with the given tag.
     * @param tag
     */
    getComponentsByTag(tag: any): ComponentSet<Component>;
    /**
     * Returns all actors in the scene with the given type.
     */
    getComponentsByType<T extends Actor | Behavior>(type: Constructor<T>): ComponentSet<T>;
    /**
     * Returns the active camera in the scene (if one is set via ActiveCameraTag).
     * If multiple cameras are set as active, the first one found is returned.
     */
    getActiveCamera(): Three.Camera;
    onLoad(): void | Promise<void>;
    onCreate(): void;
    onStart(): void;
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
    onUpdate(delta: number, elapsed: number): void;
    onDestroy(): void;
    destructor(): void;
    [OnLoad](): Promise<void>;
    [OnCreate](): void;
    [OnStart](): void;
    [OnBeforePhysicsUpdate](delta: number, elapsed: number): void;
    [OnUpdate](delta: number, elapsed: number): void;
    [OnDestroy](): void;
    [SceneLoadPromise]: Future<void>;
    [ActiveCamera]: Three.Camera;
    [Root]: SceneActor;
    [App]: Application | null;
    [Internal]: {
        loaded: boolean;
        created: boolean;
        started: boolean;
        destroyed: boolean;
    };
}
export declare class SceneActor extends Actor<Three.Scene> {
    constructor();
    onCreate(): void;
}
