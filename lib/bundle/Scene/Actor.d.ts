import * as Three from "three";
import { ActorLifecycle, Destroyable } from "../Core/Lifecycle.ts";
import { Component } from "./Component.ts";
import { Scene } from "./Scene.ts";
import { Application } from "../Core/ApplicationEntry.ts";
import { Constructor } from "../Core/Utilities.ts";
import { SparseSet } from "../Containers/SparseSet.ts";
import { Internal, OnBeforePhysicsUpdate, OnCreate, OnDisable, OnEnable, OnEnterScene, OnLeaveScene, OnReparent, OnResize, OnStart, OnUpdate } from "../Core/Internal.ts";
export declare const IsActor: unique symbol;
export declare class Actor<T extends Three.Object3D = Three.Object3D> implements ActorLifecycle, Destroyable {
    [IsActor]: boolean;
    readonly type: string;
    /**
     * The underlying Three.js object.
     * This should be used with caution, as it can break the internal state of the actor in some cases.
     */
    get object3d(): T;
    set object3d(object3d: T);
    get created(): boolean;
    get enabled(): boolean;
    get started(): boolean;
    get inScene(): boolean;
    get destroyed(): boolean;
    get app(): Application;
    get scene(): Scene;
    get parent(): Actor<Three.Object3D<Three.Object3DEventMap>>;
    get position(): Three.Vector3;
    set position(position: Three.Vector3);
    get rotation(): Three.Euler;
    set rotation(rotation: Three.Euler);
    get scale(): Three.Vector3;
    set scale(scale: Three.Vector3);
    get quaternion(): Three.Quaternion;
    set quaternion(quaternion: Three.Quaternion);
    readonly components: Set<Component>;
    readonly tags: Set<any>;
    onCreate(): void;
    onEnable(): void;
    onStart(): void;
    onEnterScene(): void;
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
    onUpdate(delta: number, elapsed: number): void;
    onLeaveScene(): void;
    onDisable(): void;
    onDestroy(): void;
    onReparent(parent: Actor | null): void;
    onResize(width: number, height: number): void;
    updateObject3d(object3d: T): void;
    /**
     * Enables this actor. This means it receives updates and is visible.
     */
    enable(): void;
    /**
     * Disables this actor. This means it does not receive updates and is not visible.
     */
    disable(): void;
    /**
     * Adds a tag to this actor.
     * @param tag
     */
    addTag(tag: any): void;
    /**
     * Removes a tag from this actor.
     * @param tag
     */
    removeTag(tag: any): void;
    /**
     * Adds a component to this actor.
     * @param component
     * @returns `true` if the component was successfully added, `false` otherwise.
     */
    addComponent(component: Component): boolean;
    /**
     * Removes a component from this actor.
     * @param component
     * @returns `true` if the component was successfully removed, `false` otherwise.
     */
    removeComponent(component: Component): boolean;
    /**
     * Reparents a component to this actor.
     * @param component
     * @returns `true` if the component was successfully reparented, `false` otherwise.
     */
    stealComponent(component: Component): boolean;
    /**
     * Reparents a component to another actor.
     * @param component
     * @param newParent
     * @returns `true` if the component was successfully reparented, `false` otherwise.
     */
    giveComponent(component: Component, newParent: Actor): boolean;
    /**
     * Gets all components of a certain type directly attached to this actor.
     */
    getComponentsByType<T extends Component>(type: Constructor<T>): SparseSet<T>;
    /**
     * Gets all components with a certain tag directly attached to this actor.
     */
    getComponentsByTag(tag: any): SparseSet<Component>;
    /**
     * Destroys this actor and all its components.
     * Recursively destroys all children actors, starting from the deepest children.
     */
    destructor(): void;
    [Internal]: {
        object3d: T;
        parent: Actor | null;
        scene: Scene | null;
        app: Application | null;
        created: boolean;
        started: boolean;
        enabled: boolean;
        inScene: boolean;
        destroyed: boolean;
        componentsByType: Map<Constructor<Component>, SparseSet<Component>>;
        componentsByTag: Map<any, SparseSet<Component>>;
    };
    [OnEnable](runEvenIfAlreadyEnabled?: boolean): void;
    [OnDisable](): void;
    [OnCreate](): void;
    [OnStart](): void;
    [OnEnterScene](): void;
    [OnBeforePhysicsUpdate](delta: number, elapsed: number): void;
    [OnUpdate](delta: number, elapsed: number): void;
    [OnLeaveScene](): void;
    [OnReparent](newParent: Actor | null): void;
    [OnResize](width: number, height: number): void;
}
