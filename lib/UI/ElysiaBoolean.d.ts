import { ElysiaElement } from "./UI";
export declare class ElysiaBoolean extends ElysiaElement {
    #private;
    static Tag: string;
    static styles: any;
    accessor input: HTMLInputElement | null;
    get value(): boolean;
    set value(val: boolean);
    accessor defaultValue: boolean;
    private controlled;
    onMount(): void;
    onRender(): any;
    private onChange;
}
