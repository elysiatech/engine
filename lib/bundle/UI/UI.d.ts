import { css, html, LitElement, PropertyDeclaration, PropertyValueMap, svg, TemplateResult } from "lit";
import { defaultScheduler, Scheduler } from "./Scheduler.ts";
import { Constructor } from "../Core/Utilities.ts";
export { css, css as c, svg, svg as s, html, html as h, defineComponent, Scheduler, defaultScheduler, ElysiaElement, OffscreenUpdateStrategy, attribute, track };
declare function defineComponent(component: Constructor<ElysiaElement> & {
    Tag: string;
}): void;
declare function attribute(options?: {
    reflect?: boolean;
    converter?: PropertyDeclaration["converter"];
    type?: PropertyDeclaration["type"];
    hasChanged?: PropertyDeclaration["hasChanged"];
}): import("lit/decorators/property.js").PropertyDecorator;
declare function track(_: any, context: any): void;
declare enum OffscreenUpdateStrategy {
    Disabled = 0,
    HighPriority = 1
}
/**
 * Base class for creating custom elements
 * */
interface ElysiaElement extends LitElement {
    /**
     * Schedule a possible update, if it's template values have changed.
     * If you want to force an update, you can call requestUpdate().
     */
    _onUpdate(): void;
    /**
     * Set the offscreen update strategy for this element.
     * @default OffscreenUpdateStrategy.Disabled
     * @param strategy
     */
    setOffscreenRenderStrategy(strategy: OffscreenUpdateStrategy): void;
    /**
     * The scheduler that this element is subscribed to.
     */
    scheduler: Scheduler;
    /**
     * Lifecycle hook that is called when the element is mounted to the DOM.
     */
    onMount?(): void;
    /**
     * Lifecycle hook that is called before the element is updated.
     */
    onBeforeUpdate?(): void;
    /**
     * Lifecycle hook that returns a UI result.
     */
    onRender(): TemplateResult;
    /**
     * Lifecycle hook that is called after the element is updated.
     */
    onAfterUpdate?(): void;
    /**
     * Lifecycle hook that is called when the element is unmounted from the DOM.
     */
    onUnmount?(): void;
}
declare class ElysiaElement extends LitElement {
    #private;
    static Tag: string;
    static ManualTracking: boolean;
    scheduler: Scheduler;
    get offscreen(): boolean;
    get offscreenUpdateStrategy(): OffscreenUpdateStrategy;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setOffscreenUpdateStrategy(value: OffscreenUpdateStrategy): void;
    render(): TemplateResult;
    protected componentVisibilityObserver?: IntersectionObserver;
    protected fieldsToCheck: string[];
    protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    private compareRenderOutput;
}
export declare function BooleanConverter(val: any): boolean;
