import { ElysiaElement } from "./UI.ts";
export declare class ElysiaNumberInput extends ElysiaElement {
    static Tag: string;
    static styles: import("lit").CSSResult;
    accessor input: Element | null;
    accessor value: number | undefined;
    accessor defaultValue: number;
    accessor min: string;
    accessor max: string;
    accessor step: number;
    private controlled;
    onMount(): void;
    onRender(): import("lit").TemplateResult<1>;
    initialMousePos: {
        x: number;
        y: number;
    };
    onMouseDown: (e: MouseEvent) => void;
    onMouseDrag: (e: MouseEvent) => void;
    onMouseUp: () => void;
    private onChange;
}
