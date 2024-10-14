import { ElysiaElement } from "./UI.ts";
export declare class Scheduler {
    frametime: number;
    components: Set<ElysiaElement>;
    subscribe(component: ElysiaElement): void;
    unsubscribe(component: ElysiaElement): void;
    update(): void;
}
export declare const defaultScheduler: Scheduler;
