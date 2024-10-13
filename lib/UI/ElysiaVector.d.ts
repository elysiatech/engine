import { ElysiaElement } from "./UI";
export declare class ElysiaVector extends ElysiaElement {
    static Tag: string;
    static styles: any;
    accessor value: Record<string, number>;
    onRender(): any;
    private createElement;
    private onInput;
}
