import { ElysiaElement } from "./UI.ts";
export declare class ElysiaEnum extends ElysiaElement {
    #private;
    static Tag: string;
    static styles: import("lit").CSSResult;
    accessor value: string;
    accessor options: string[];
    onChange?: (value: string) => void;
    onRender(): import("lit").TemplateResult<1>;
}
