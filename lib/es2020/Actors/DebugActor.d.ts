import { Actor } from "../Scene/Actor.ts";
/** An actor that renders a debug bounding box and axis for its parent actor. */
export declare class DebugActor extends Actor {
    #private;
    /** Adds a debug helper to an Actor. */
    static Debug(a: Actor): DebugActor;
    onEnterScene(): void;
    onUpdate(delta: number, elapsed: number): void;
    onLeaveScene(): void;
}
