import { ElysiaElement } from "./UI.ts";
export declare class ElysiaUiStats extends ElysiaElement {
    static Tag: string;
    visible: boolean;
    scheduler: import("./Scheduler.ts").Scheduler;
    static styles: import("lit").CSSResult;
    onMount(): void;
    onRender(): import("lit").TemplateResult<1>;
}
