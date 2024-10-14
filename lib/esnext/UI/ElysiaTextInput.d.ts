import { ElysiaElement } from "./UI.ts";
export declare class ElysiaTextInput extends ElysiaElement {
    static Tag: string;
    static styles: import("lit").CSSResult;
    accessor value: string;
    accessor placeholder: string;
    onChange?: (value: string) => void;
    onRender(): import("lit").TemplateResult<1>;
}
