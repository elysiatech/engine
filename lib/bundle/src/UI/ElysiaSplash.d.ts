import { ElysiaElement } from "./UI.ts";
export declare class ElysiaSplash extends ElysiaElement {
    static Tag: string;
    static ManualTracking: boolean;
    static styles: import("lit").CSSResult;
    accessor container: HTMLElement;
    mountedAt: number;
    onMount(): void;
    goodbye: () => void;
    onRender(): import("lit").TemplateResult<1>;
}
