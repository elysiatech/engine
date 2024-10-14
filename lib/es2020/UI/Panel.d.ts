import { ElysiaElement } from "./UI.ts";
import { ReactiveController, ReactiveControllerHost, TemplateResult } from "lit";
import { type Ref } from "lit/directives/ref.js";
import "./Widgets";
export declare class DraggableController implements ReactiveController {
    #private;
    private host;
    mouseDown: boolean;
    dragging: boolean;
    start: {
        x: number;
        y: number;
    };
    offset: {
        x: number;
        y: number;
    };
    last: {
        x: number;
        y: number;
    };
    x: number;
    y: number;
    constructor(host: HTMLElement & ReactiveControllerHost);
    bindHandle(): Ref;
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
}
export declare class CollapsableController implements ReactiveController {
    #private;
    private host;
    isOpen: boolean;
    constructor(host: ReactiveControllerHost & HTMLElement);
    hostConnected(): void;
    bindTrigger(): Ref;
    bindContainer(): Ref;
    open({ immediate }?: {
        immediate?: boolean | undefined;
    }): void;
    close({ immediate }?: {
        immediate?: boolean | undefined;
    }): void;
    toggle({ immediate }?: {
        immediate?: boolean | undefined;
    }): void;
}
export declare class ElysiaFloatingPanel extends ElysiaElement {
    static Tag: string;
    static styles: import("lit").CSSResult;
    accessor header: Element | null;
    dragger: DraggableController;
    dropper: CollapsableController;
    constructor();
    onRender(): TemplateResult<1>;
}
export declare class ElysiaFloatingPanelTest extends ElysiaElement {
    static Tag: string;
    static styles: import("lit").CSSResult;
    vec: {
        x: number;
        y: number;
    };
    number: number;
    bool: boolean;
    onRender(): TemplateResult<1>;
}
