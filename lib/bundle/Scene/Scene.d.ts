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
import { s_ActiveCamera, s_App, s_Created, s_Destroyed, s_Loaded, s_OnBeforePhysicsUpdate, s_OnCreate, s_OnDestroy, s_OnLoad, s_OnStart, s_OnUpdate, s_SceneLoadPromise, s_Started } from "./Internal.ts";
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
    /** Get the s_Scene grid actor */
    get grid(): GridActor;
    /** Get the s_Scene's ambient light */
    get ambientLight(): Three.AmbientLight;
    /** The s_Scene's active camera */
    get activeCamera(): Three.Camera | Actor<Three.Camera>;
    set activeCamera(camera: Three.Camera | Actor<Three.Camera>);
    constructor();
    /**
     * Adds a component to this s_Scene.
     * @param component
     */
    addComponent(...components: Component[]): this;
    /**
     * Removes a component to this s_Scene.
     * @param component
     * @returns `true` if the component was successfully added, `false` otherwise.
     */
    removeComponent(...components: Component[]): this;
    /**
     * Returns all actors in the s_Scene with the given tag.
     * @param tag
     */
    getComponentsByTag(tag: any): ComponentSet<Component>;
    /**
     * Returns all actors in the s_Scene with the given type.
     */
    getComponentsByType<T extends Actor | Behavior>(type: Constructor<T>): ComponentSet<T>;
    /**
     * Returns the active camera in the s_Scene (if one is set via ActiveCameraTag).
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
    [s_OnLoad](): Promise<void>;
    [s_OnCreate](): void;
    [s_OnStart](): void;
    [s_OnBeforePhysicsUpdate](delta: number, elapsed: number): void;
    [s_OnUpdate](delta: number, elapsed: number): void;
    [s_OnDestroy](): void;
    [s_SceneLoadPromise]: Future<void>;
    [s_ActiveCamera]: Three.Camera;
    [Root]: SceneActor;
    [s_App]: Application | null;
    [s_Loaded]: boolean;
    [s_Created]: boolean;
    [s_Started]: boolean;
    [s_Destroyed]: boolean;
}
export declare class SceneActor extends Actor<Three.Scene> {
    constructor();
}
