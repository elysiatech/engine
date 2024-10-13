import { ElysiaElement } from "./UI";
import "corel-color-picker/corel-color-picker.js";
export declare class ElysiaColorPicker extends ElysiaElement {
    #private;
    static Tag: string;
    static styles: any;
    accessor picker: Element | null;
    open: boolean;
    color: string;
    onRender(): any;
}
