import * as Three from "three";
import { ActorLifecycle, Destroyable } from "../Core/Lifecycle.ts";
import { Component } from "./Component.ts";
import { Scene } from "./Scene.ts";
import { Application } from "../Core/ApplicationEntry.ts";
import { Constructor } from "../Core/Utilities.ts";
import { ComponentSet } from "../Containers/ComponentSet.ts";
import { s_App, s_Created, s_Destroyed, s_Enabled, s_InScene, s_Internal, s_Object3D, s_OnBeforePhysicsUpdate, s_OnCreate, s_OnDestroy, s_OnDisable, s_OnEnable, s_OnEnterScene, s_OnLeaveScene, s_OnReparent, s_OnResize, s_OnStart, s_OnUpdate, s_Parent, s_Scene, s_Started } from "./Internal.ts";
export declare const IsActor: unique symbol;
export declare const s_ComponentsByType: unique symbol;
export declare const s_ComponentsByTag: unique symbol;
export declare class Actor<T extends Three.Object3D = Three.Object3D> implements ActorLifecycle, Destroyable {
    [IsActor]: boolean;
    readonly type: string;
    /**
     * The underlying Three.js object.
     * This should be used with caution, as it can break the internal state of the actor in some cases.
     */
    get object3d(): T;
    set object3d(object3d: T);
    /** Whether this actor has finished it's onCreate() lifecycle. */
    get created(): boolean;
    /** If the actor is enabled. */
    get enabled(): boolean;
    /** Whether this actor has finished it's onStart() lifecycle. */
    get started(): boolean;
    /** Whether this actor is in the scene. */
    get inScene(): boolean;
    /** Whether this actor is destroyed */
    get destroyed(): boolean;
    /** The Application instance of this actor. */
    get app(): Application;
    /** The Scene instance of this actor. */
    get scene(): Scene;
    /** The parent actor of this actor. */
    get parent(): Actor<Three.Object3D<Three.Object3DEventMap>>;
    /** The position of this actor. */
    get position(): Three.Vector3;
    set position(position: Three.Vector3);
    /** The rotation of this actor. */
    get rotation(): Three.Euler;
    set rotation(rotation: Three.Euler);
    /** The scale of this actor. */
    get scale(): Three.Vector3;
    set scale(scale: Three.Vector3);
    /** The quaternion of this actor. */
    get quaternion(): Three.Quaternion;
    set quaternion(quaternion: Three.Quaternion);
    /** The child components of this actor. */
    readonly components: Set<Component>;
    /** The tags of this actor. */
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
    updateObject3d(newObject3d: T): void;
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
     * Gets all components of a certain type directly attached to this actor.
     */
    getComponentsByType<T extends Component>(type: Constructor<T>): ComponentSet<T>;
    /**
     * Gets all components with a certain tag directly attached to this actor.
     */
    getComponentsByTag(tag: any): ComponentSet<Component>;
    /**
     * Destroys this actor and all its components.
     * Recursively destroys all children actors, starting from the deepest children.
     */
    destructor(): void;
    [s_Object3D]: T;
    [s_Parent]: Actor | null;
    [s_Scene]: Scene | null;
    [s_App]: Application | null;
    [s_Created]: boolean;
    [s_Started]: boolean;
    [s_Enabled]: boolean;
    [s_Internal]: {
        _enabled: boolean;
    };
    [s_InScene]: boolean;
    [s_Destroyed]: boolean;
    [s_ComponentsByType]: Map<Constructor<Component>, ComponentSet<Component>>;
    [s_ComponentsByTag]: Map<any, ComponentSet<Component>>;
    [s_OnEnable](force?: boolean): void;
    [s_OnDisable](): void;
    [s_OnCreate](): void;
    [s_OnEnterScene](): void;
    [s_OnStart](): void;
    [s_OnBeforePhysicsUpdate](delta: number, elapsed: number): void;
    [s_OnUpdate](delta: number, elapsed: number): void;
    [s_OnLeaveScene](): void;
    [s_OnDestroy](): void;
    [s_OnReparent](newParent: Actor | null): void;
    [s_OnResize](width: number, height: number): void;
}
