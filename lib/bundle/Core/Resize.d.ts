import { Destroyable } from "./Lifecycle.ts";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.ts";
import { ElysiaEvent } from "../Events/Event.ts";
export declare class ResizeEvent extends ElysiaEvent<{
    x: number;
    y: number;
}> {
}
export declare class ResizeController implements Destroyable {
    #private;
    private element?;
    width: number;
    height: number;
    constructor(element?: HTMLElement | undefined);
    addEventListener: ElysiaEventDispatcher["addEventListener"];
    removeEventListener: ElysiaEventDispatcher["removeEventListener"];
    destructor(): void;
}
