import { ElysiaElement } from "./UI";
export declare class ElysiaEnum extends ElysiaElement {
    #private;
    static Tag: string;
    static styles: any;
    accessor value: string;
    accessor options: string[];
    onChange?: (value: string) => void;
    onRender(): any;
}
