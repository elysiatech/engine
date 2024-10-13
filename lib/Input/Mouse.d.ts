import { Destroyable } from "../Core/Lifecycle";
export declare class MouseObserver implements Destroyable {
    #private;
    private target;
    get x(): number;
    get y(): number;
    get leftDown(): boolean;
    get middleDown(): boolean;
    get rightDown(): boolean;
    get fourDown(): boolean;
    get fiveDown(): boolean;
    constructor(target: HTMLElement);
    addEventListener(type: "mousemove" | "mousedown" | "mouseup", callback: (event: MouseEvent) => void): () => void;
    removeEventListener(type: "mousemove" | "mousedown" | "mouseup", callback: (event: MouseEvent) => void): void;
    destructor(): void;
}
