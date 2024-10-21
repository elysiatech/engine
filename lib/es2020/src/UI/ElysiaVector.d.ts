import { ElysiaElement } from "./UI.ts";
export declare class ElysiaVector extends ElysiaElement {
    static Tag: string;
    static styles: import("lit").CSSResult;
    accessor value: Record<string, number>;
    onRender(): import("lit").TemplateResult<1>;
    private createElement;
    private onInput;
}
