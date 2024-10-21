import { ActorLifecycle, Destroyable } from "../Core/Lifecycle.ts";
import { Actor } from "./Actor.ts";
import { Scene } from "./Scene.ts";
import { Application } from "../Core/ApplicationEntry.ts";
import { s_App, s_Created, s_Destroyed, s_Enabled, s_InScene, s_Internal, s_OnBeforePhysicsUpdate, s_OnCreate, s_OnDestroy, s_OnDisable, s_OnEnable, s_OnEnterScene, s_OnLeaveScene, s_OnReparent, s_OnResize, s_OnStart, s_OnUpdate, s_Parent, s_Scene, s_Started, s_Tags } from "./Internal.ts";
import * as Three from "three";
export declare const IsBehavior: unique symbol;
/**
 * A behavior is a component that can be attached to an actor to add functionality.
 * It has no children but participates in the actor lifecycle.
 */
export declare class Behavior implements ActorLifecycle, Destroyable {
    [IsBehavior]: boolean;
    readonly type: string;
    /** If this behavior has completed it's onCreate() lifecycle. */
    get created(): boolean;
    /** If this behavior has completed it's onStart() lifecycle. */
    get started(): boolean;
    /** If this behavior has been destroyed. */
    get destroyed(): boolean;
    /** If this behavior is enabled. */
    get enabled(): boolean;
    /** The parent actor of this behavior. */
    get parent(): Actor<Three.Object3D<Three.Object3DEventMap>>;
    /** The scene this behavior belongs to. */
    get scene(): Scene;
    /** The application this behavior belongs to. */
    get app(): Application;
    /** The tags associated with this behavior. */
    get tags(): Set<any>;
    /** Enable this behavior. */
    enable(): void;
    /** Disable this behavior. */
    disable(): void;
    /**
     * Adds a tag to this behavior
     * @param tag
     */
    addTag(tag: any): void;
    /**
     * Removes a tag from this behavior.
     * @param tag
     */
    removeTag(tag: any): void;
    onCreate(): void;
    onEnterScene(): void;
    onEnable(): void;
    onStart(): void;
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
    onUpdate(delta: number, elapsed: number): void;
    onDisable(): void;
    onLeaveScene(): void;
    onDestroy(): void;
    onReparent(parent: Actor | null): void;
    onResize(width: number, height: number): void;
    destructor(): void;
    [s_App]: Application | null;
    [s_Scene]: Scene | null;
    [s_Parent]: Actor | null;
    [s_Tags]: Set<any>;
    [s_Enabled]: boolean;
    [s_Internal]: {
        _enabled: boolean;
    };
    [s_Created]: boolean;
    [s_Started]: boolean;
    [s_InScene]: boolean;
    [s_Destroyed]: boolean;
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
