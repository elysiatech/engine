import { ElysiaElement } from "./UI.ts";
export declare class ElysiaStats extends ElysiaElement {
    static Tag: string;
    visible: boolean;
    stats: {
        calls: number;
        fps: number;
        lines: number;
        points: number;
        triangles: number;
        memory: number;
    };
    static styles: import("lit").CSSResult;
    onMount(): void;
    onRender(): import("lit").TemplateResult<1>;
}
