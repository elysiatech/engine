import { KeyCode } from "./KeyCode.ts";
import { MouseCode } from "./MouseCode.ts";
export declare class QueuedEvent {
    key: KeyCode | MouseCode;
    type: "down" | "up";
    timestamp: number;
    ctrlDown: boolean;
    shiftDown: boolean;
    spaceDown: boolean;
    altDown: boolean;
    metaDown: boolean;
    mouseLeftDown: boolean;
    mouseMidDown: boolean;
    mouseRightDown: boolean;
    mouseX: number;
    mouseY: number;
    constructor(key?: KeyCode | MouseCode, type?: "down" | "up", timestamp?: number, ctrlDown?: boolean, shiftDown?: boolean, spaceDown?: boolean, altDown?: boolean, metaDown?: boolean, mouseLeftDown?: boolean, mouseMidDown?: boolean, mouseRightDown?: boolean, mouseX?: number, mouseY?: number);
    clone(): QueuedEvent;
}
