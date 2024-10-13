import { ElysiaElement } from "./UI";
export declare class ElysiaNumberInput extends ElysiaElement {
    static Tag: string;
    static styles: any;
    accessor input: Element | null;
    accessor value: number | undefined;
    accessor defaultValue: number;
    accessor min: string;
    accessor max: string;
    accessor step: number;
    private controlled;
    onMount(): void;
    onRender(): any;
    initialMousePos: {
        x: number;
        y: number;
    };
    onMouseDown: (e: MouseEvent) => void;
    onMouseDrag: (e: MouseEvent) => void;
    onMouseUp: () => void;
    private onChange;
}
