import { ElysiaElement } from "./UI";
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
    static styles: any;
    onMount(): void;
    onRender(): any;
}
