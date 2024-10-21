import { LitElement, nothing } from "lit";
export declare class ElysiaCrossHair extends LitElement {
    static styles: import("lit").CSSResult;
    accessor gap: number;
    accessor thickness: number;
    accessor length: number;
    accessor color: string;
    accessor dot: boolean;
    accessor outline: boolean;
    accessor t: boolean;
    accessor visible: boolean;
    connectedCallback(): void;
    render(): import("lit").TemplateResult<1> | typeof nothing;
    private updateStyles;
}
