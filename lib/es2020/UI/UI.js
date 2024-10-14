var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ElysiaElement_renderResult, _ElysiaElement_offscreen, _ElysiaElement_offscreenUpdateStrategy;
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
    get offscreen() { return __classPrivateFieldGet(this, _ElysiaElement_offscreen, "f"); }
    get offscreenUpdateStrategy() { return __classPrivateFieldGet(this, _ElysiaElement_offscreenUpdateStrategy, "f"); }
    constructor() {
        super();
        Object.defineProperty(this, "scheduler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: defaultScheduler
        });
        Object.defineProperty(this, "componentVisibilityObserver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // @ts-ignore
        Object.defineProperty(this, "fieldsToCheck", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [!this.constructor.ManualTracking && "onRender"].filter(Boolean)
        });
        _ElysiaElement_renderResult.set(this, void 0);
        _ElysiaElement_offscreen.set(this, true);
        _ElysiaElement_offscreenUpdateStrategy.set(this, OffscreenUpdateStrategy.Disabled);
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
                __classPrivateFieldSet(this, _ElysiaElement_offscreen, false, "f");
                this.scheduler.subscribe(this);
            }
            else {
                __classPrivateFieldSet(this, _ElysiaElement_offscreen, true, "f");
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
                    if (!__classPrivateFieldGet(this, _ElysiaElement_renderResult, "f")
                        || this.compareRenderOutput(__classPrivateFieldGet(this, _ElysiaElement_renderResult, "f").values, currentRender.values)
                        || this.compareRenderOutput(__classPrivateFieldGet(this, _ElysiaElement_renderResult, "f").strings, currentRender.strings)) {
                        __classPrivateFieldSet(this, _ElysiaElement_renderResult, currentRender, "f");
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
        __classPrivateFieldSet(this, _ElysiaElement_offscreenUpdateStrategy, value, "f");
        if (this.offscreen) {
            if (value === OffscreenUpdateStrategy.Disabled)
                this.scheduler.unsubscribe(this);
            if (value === OffscreenUpdateStrategy.HighPriority)
                this.scheduler.subscribe(this);
        }
    }
    render() { return __classPrivateFieldGet(this, _ElysiaElement_renderResult, "f") ?? this.onRender(); }
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
}
_ElysiaElement_renderResult = new WeakMap(), _ElysiaElement_offscreen = new WeakMap(), _ElysiaElement_offscreenUpdateStrategy = new WeakMap();
Object.defineProperty(ElysiaElement, "Tag", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "unknown-elysia-element"
});
Object.defineProperty(ElysiaElement, "ManualTracking", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
export function BooleanConverter(val) {
    if (val && val !== "false")
        return true;
    return val === "";
}
