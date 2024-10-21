import { ElysiaElement } from "./UI.ts";
export declare class ElysiaBoolean extends ElysiaElement {
    #private;
    static Tag: string;
    static styles: import("lit").CSSResult;
    accessor input: HTMLInputElement | null;
    get value(): boolean;
    set value(val: boolean);
    accessor defaultValue: boolean;
    private controlled;
    onMount(): void;
    onRender(): import("lit").TemplateResult<1>;
    private onChange;
}
