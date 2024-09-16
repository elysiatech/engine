import { LitElement, html, css, svg } from "lit";
import { Scheduler, defaultScheduler } from "./Scheduler";
import { property, query } from "lit/decorators.js";
/****************************************************************************************
 * Exports
 *****************************************************************************************/
export { query as ref, css, css as c, svg, svg as s, html, html as h, attribute, defineComponent, Scheduler, defaultScheduler, ElysiaElement, OffscreenUpdateStrategy };
const isLitTemplateResult = (value) => {
    return !!value && (typeof value === "object") && ("_$litType$" in value);
};
const isFn = (value) => {
    return typeof value === "function";
};
function defineComponent(component) {
    if (!component.Tag || component.Tag === "elysia-element") {
        throw new Error(`You must define a tag for ${component.name}!`);
    }
    if (!customElements.get(component.Tag)) {
        customElements.define(component.Tag, component);
    }
}
/****************************************************************************************
 * Decorators
 *****************************************************************************************/
function attribute(options = {}) {
    return property({
        attribute: options.attribute ?? true,
        reflect: options.reflect,
        converter: options.converter
    });
}
var OffscreenUpdateStrategy;
(function (OffscreenUpdateStrategy) {
    OffscreenUpdateStrategy[OffscreenUpdateStrategy["Disabled"] = 0] = "Disabled";
    OffscreenUpdateStrategy[OffscreenUpdateStrategy["HighPriority"] = 1] = "HighPriority";
})(OffscreenUpdateStrategy || (OffscreenUpdateStrategy = {}));
class ElysiaElement extends LitElement {
    static Tag = "elysia-element";
    scheduler = defaultScheduler;
    get offscreen() {
        return this.#offscreen;
    }
    get offscreenUpdateStrategy() {
        return this.#offscreenUpdateStrategy;
    }
    constructor() {
        super();
        this.providedRenderFunction = this.render;
        this.render = function render() { return this.renderResult ?? this.providedRenderFunction(); };
    }
    connectedCallback() {
        super.connectedCallback();
        this.onMount && this.onMount();
        this.observer.observe(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.scheduler.unsubscribe(this);
        this.observer.disconnect();
        this.onUnmount && this.onUnmount();
    }
    requestRender() {
        if (this.isUpdatePending)
            return;
        const currentRender = this.providedRenderFunction();
        if (isLitTemplateResult(currentRender)) {
            if (!this.renderResult
                || this.compareRenderOutput(this.renderResult.values, currentRender.values)
                || this.compareRenderOutput(this.renderResult.strings, currentRender.strings)) {
                this.renderResult = currentRender;
                this.requestUpdate();
                this.onBeforeUpdate && this.onBeforeUpdate();
            }
        }
        else {
            throw Error("ImHTML render method must return a lit-html template result");
        }
    }
    setOffscreenUpdateStrategy(value) {
        this.#offscreenUpdateStrategy = value;
        if (this.offscreen) {
            if (value === OffscreenUpdateStrategy.Disabled) {
                this.scheduler.unsubscribe(this);
            }
            if (value === OffscreenUpdateStrategy.HighPriority) {
                this.scheduler.subscribe(this);
            }
        }
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        this.onAfterUpdate && this.onAfterUpdate();
    }
    providedRenderFunction;
    renderResult;
    observer = new IntersectionObserver((entries) => {
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
    compareRenderOutput(a, b) {
        // if the lengths are different, we know the values are different and bail early
        if (a.length !== b.length) {
            return true;
        }
        for (let i = 0; i < a.length; i++) {
            const prev = a[i], next = b[i];
            // functions are compared by name
            if (isFn(prev) && isFn(next)) {
                if (prev.name !== next.name) {
                    return true;
                }
                else {
                    continue;
                }
            }
            // lit template results are compared by their values
            if (isLitTemplateResult(prev) && isLitTemplateResult(next)) {
                return this.compareRenderOutput(prev.values, next.values) && this.compareRenderOutput(prev.strings, next.strings);
            }
            // arrays are deeply compared
            if (Array.isArray(prev) && Array.isArray(next)) {
                return this.compareRenderOutput(prev, next);
            }
            // strict equality check
            if (a[i] !== b[i]) {
                return true;
            }
        }
        return false;
    }
    #offscreen = true;
    #offscreenUpdateStrategy = OffscreenUpdateStrategy.Disabled;
}
