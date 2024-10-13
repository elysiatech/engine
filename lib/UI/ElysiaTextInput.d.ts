import { ElysiaElement } from "./UI";
export declare class ElysiaTextInput extends ElysiaElement {
    static Tag: string;
    static styles: any;
    accessor value: string;
    accessor placeholder: string;
    onChange?: (value: string) => void;
    onRender(): any;
}
