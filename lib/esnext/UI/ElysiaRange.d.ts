import { ElysiaElement } from "./UI.ts";
export declare class ElysiaRange extends ElysiaElement {
    #private;
    static Tag: string;
    static styles: import("lit").CSSResult;
    accessor value: string;
    accessor min: string;
    accessor max: string;
    accessor step: string;
    onChange?: (value: number) => void;
    onRender(): import("lit").TemplateResult<1>;
}
