import { ActorLifecycle, Destroyable } from "../Core/Lifecycle";
import { Actor } from "./Actor";
import { Scene } from "./Scene";
import { Application } from "../Core/ApplicationEntry";
export declare const IsBehavior: unique symbol;
/**
 * A behavior is a component that can be attached to an actor to add functionality.
 * It has no children but participates in the actor lifecycle.
 */
export declare class Behavior implements ActorLifecycle, Destroyable {
    [x: number]: {
        app: Application | null;
        scene: Scene | null;
        parent: Actor | null;
        tags: Set<any>;
        enabled: boolean;
        created: boolean;
        started: boolean;
        inScene: boolean;
        destroyed: boolean;
    } | ((runEvenIfAlreadyEnabled?: boolean) => void) | ((delta: number, elapsed: number) => void);
    [IsBehavior]: boolean;
    readonly type: string;
    get created(): any;
    get started(): any;
    get destroyed(): any;
    get enabled(): any;
    /**
     * The parent actor of this behavior.
     */
    get parent(): any;
    /**
     * The scene this behavior belongs
     * to, if any.
     */
    get scene(): any;
    /**
     * The application this behavior belongs to.
     */
    get app(): any;
    /**
     * The tags associated with this behavior.
     */
    get tags(): any;
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
    onEnable(): void;
    onStart(): void;
    onEnterScene(): void;
    onBeforePhysicsUpdate(delta: number, elapsed: number): void;
    onUpdate(delta: number, elapsed: number): void;
    onDisable(): void;
    onLeaveScene(): void;
    onDestroy(): void;
    onReparent(parent: Actor | null): void;
    onResize(width: number, height: number): void;
    destructor(): void;
}
