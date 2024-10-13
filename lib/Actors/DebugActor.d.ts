import { Actor } from "../Scene/Actor";
export declare class DebugActor extends Actor {
    #private;
    static Debug(a: Actor): DebugActor;
    onEnterScene(): void;
    onUpdate(delta: number, elapsed: number): void;
    onLeaveScene(): void;
}
