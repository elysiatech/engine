import { ElysiaElement } from "./UI";
export declare class ElysiaRange extends ElysiaElement {
    #private;
    static Tag: string;
    static styles: any;
    accessor value: string;
    accessor min: string;
    accessor max: string;
    accessor step: string;
    onChange?: (value: number) => void;
    onRender(): any;
}
