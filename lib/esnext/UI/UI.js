import { css, html, LitElement, svg } from "lit";
import { defaultScheduler, Scheduler } from "./Scheduler.js";
import { isFunction } from "../Core/Asserts.js";
import { property } from "lit/decorators/property.js";
export { css, css as c, svg, svg as s, html, html as h, defineComponent, Scheduler, defaultScheduler, ElysiaElement, OffscreenUpdateStrategy, attribute, track };
const isLitTemplateResult = (value) => !!value && (typeof value === "object") && ("_$litType$" in value);
function defineComponent(component) {
    if (!component.Tag || component.Tag === "unknown-elysia-element") {
        throw new Error(`You must define a tag for ${component.name}!`);
    }
    if (!customElements.get(component.Tag)) {
        customElements.define(component.Tag, component);
    }
}
const strictEqual = (a, b) => a === b;
function attribute(options = {}) {
    return property({
        attribute: true,
        reflect: options.reflect ?? true,
        converter: options.converter,
        hasChanged: options.hasChanged ?? strictEqual,
        type: options.type,
    });
}
// @ts-ignore todo: type decorators
function track(_, context) {
    if (context.kind !== "getter" && context.kind !== "field" && context.kind !== "accessor")
        throw new Error("Track decorator can only be applied to fields, getters, and accessors.");
    context.addInitializer(function () {
        // @ts-ignore
        this.fieldsToCheck.push(context.name);
    });
}
var OffscreenUpdateStrategy;
(function (OffscreenUpdateStrategy) {
    OffscreenUpdateStrategy[OffscreenUpdateStrategy["Disabled"] = 0] = "Disabled";
    OffscreenUpdateStrategy[OffscreenUpdateStrategy["HighPriority"] = 1] = "HighPriority";
})(OffscreenUpdateStrategy || (OffscreenUpdateStrategy = {}));
class ElysiaElement extends LitElement {
    static Tag = "unknown-elysia-element";
    static ManualTracking = false;
    scheduler = defaultScheduler;
    get offscreen() { return this.#offscreen; }
    get offscreenUpdateStrategy() { return this.#offscreenUpdateStrategy; }
    constructor() {
        super();
        this.compareRenderOutput = this.compareRenderOutput.bind(this);
        this._onUpdate = this._onUpdate.bind(this);
        this.setOffscreenRenderStrategy = this.setOffscreenUpdateStrategy.bind(this);
        this.onRender = this.onRender.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.onMount && this.onMount();
        this.componentVisibilityObserver = new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                this.#offscreen = false;
                this.scheduler.subscribe(this);
            }
            else {
                this.#offscreen = true;
                this.setOffscreenUpdateStrategy(this.offscreenUpdateStrategy);
            }
        }, {
            rootMargin: "25px"
        });
        this.componentVisibilityObserver.observe(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.scheduler.unsubscribe(this);
        this.componentVisibilityObserver?.disconnect();
        this.onUnmount && this.onUnmount();
    }
    _onUpdate() {
        if (this.isUpdatePending)
            return;
        for (const field of this.fieldsToCheck) {
            if (field == 'onRender') {
                const currentRender = this.onRender();
                if (isLitTemplateResult(currentRender)) {
                    if (!this.#renderResult
                        || this.compareRenderOutput(this.#renderResult.values, currentRender.values)
                        || this.compareRenderOutput(this.#renderResult.strings, currentRender.strings)) {
                        this.#renderResult = currentRender;
                        this.requestUpdate();
                        this.onBeforeUpdate && this.onBeforeUpdate();
                    }
                }
                else {
                    throw Error("ImHTML render method must return a lit-html template result");
                }
            }
            else {
                // @ts-ignore
                if (this[field] !== this[`_elysia_internal_${field}`]) {
                    // @ts-ignore
                    this[`_elysia_internal_${field}`] = this[field];
                    this.requestUpdate();
                    this.onBeforeUpdate && this.onBeforeUpdate();
                    break;
                }
            }
        }
    }
    setOffscreenUpdateStrategy(value) {
        this.#offscreenUpdateStrategy = value;
        if (this.offscreen) {
            if (value === OffscreenUpdateStrategy.Disabled)
                this.scheduler.unsubscribe(this);
            if (value === OffscreenUpdateStrategy.HighPriority)
                this.scheduler.subscribe(this);
        }
    }
    render() { return this.#renderResult ?? this.onRender(); }
    componentVisibilityObserver;
    // @ts-ignore
    fieldsToCheck = [!this.constructor.ManualTracking && "onRender"].filter(Boolean);
    updated(_changedProperties) {
        super.updated(_changedProperties);
        this.onAfterUpdate && this.onAfterUpdate();
    }
    compareRenderOutput(a, b) {
        // if the lengths are different, we know the values are different and bail early
        if (a?.length !== b?.length)
            return true;
        for (let i = 0; i < a?.length; i++) {
            const prev = a[i], next = b[i];
            // functions are compared by name
            if (isFunction(prev) && isFunction(next)) {
                if (prev.name !== next.name)
                    return true;
                else
                    continue;
            }
            // lit template results are compared by their values
            if (isLitTemplateResult(prev) && isLitTemplateResult(next)) {
                return this.compareRenderOutput(prev.values, next.values) && this.compareRenderOutput(prev.strings, next.strings);
            }
            // arrays are deeply compared
            if (Array.isArray(prev) && Array.isArray(next))
                return this.compareRenderOutput(prev, next);
            // strict equality check
            if (a[i] !== b[i])
                return true;
        }
        return false;
    }
    #renderResult;
    #offscreen = true;
    #offscreenUpdateStrategy = OffscreenUpdateStrategy.Disabled;
}
export function BooleanConverter(val) {
    if (val && val !== "false")
        return true;
    return val === "";
}
