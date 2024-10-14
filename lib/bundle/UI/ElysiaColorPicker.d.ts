import { ElysiaElement } from "./UI.ts";
import "corel-color-picker/corel-color-picker.js";
export declare class ElysiaColorPicker extends ElysiaElement {
    #private;
    static Tag: string;
    static styles: import("lit").CSSResult;
    accessor picker: Element | null;
    open: boolean;
    color: string;
    onRender(): import("lit").TemplateResult<1>;
}
