import { ActorLifecycle, Destroyable } from "../Core/Lifecycle.ts";
import { Actor } from "./Actor.ts";
import { Scene } from "./Scene.ts";
import { Application } from "../Core/ApplicationEntry.ts";
import { Internal, OnBeforePhysicsUpdate, OnCreate, OnDestroy, OnDisable, OnEnable, OnEnterScene, OnLeaveScene, OnReparent, OnResize, OnStart, OnUpdate } from "../Core/Internal.ts";
import * as Three from "three";
export declare const IsBehavior: unique symbol;
/**
 * A behavior is a component that can be attached to an actor to add functionality.
 * It has no children but participates in the actor lifecycle.
 */
export declare class Behavior implements ActorLifecycle, Destroyable {
    [IsBehavior]: boolean;
    readonly type: string;
    get created(): boolean;
    get started(): boolean;
    get destroyed(): boolean;
    get enabled(): boolean;
    /**
     * The parent actor of this behavior.
     */
    get parent(): Actor<Three.Object3D<Three.Object3DEventMap>>;
    /**
     * The scene this behavior belongs
     * to, if any.
     */
    get scene(): Scene;
    /**
     * The application this behavior belongs to.
     */
    get app(): Application;
    /**
     * The tags associated with this behavior.
     */
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
    [Internal]: {
        app: Application | null;
        scene: Scene | null;
        parent: Actor | null;
        tags: Set<any>;
        enabled: boolean;
        created: boolean;
        started: boolean;
        inScene: boolean;
        destroyed: boolean;
    };
    [OnEnable](force?: boolean): void;
    [OnDisable](): void;
    [OnCreate](): void;
    [OnEnterScene](): void;
    [OnStart](): void;
    [OnBeforePhysicsUpdate](delta: number, elapsed: number): void;
    [OnUpdate](delta: number, elapsed: number): void;
    [OnLeaveScene](): void;
    [OnDestroy](): void;
    [OnReparent](newParent: Actor | null): void;
    [OnResize](width: number, height: number): void;
}
