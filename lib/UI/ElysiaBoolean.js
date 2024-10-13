var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { attribute, BooleanConverter, css, defineComponent, ElysiaElement, html } from "./UI";
import { query } from "lit/decorators.js";
import { bound, toBoolean } from "../Core/Utilities";
let ElysiaBoolean = (() => {
    let _classSuper = ElysiaElement;
    let _instanceExtraInitializers = [];
    let _input_decorators;
    let _input_initializers = [];
    let _input_extraInitializers = [];
    let _set_value_decorators;
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _onChange_decorators;
    return class ElysiaBoolean extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _input_decorators = [query("#input")];
            _set_value_decorators = [attribute()];
            _defaultValue_decorators = [attribute({ converter: BooleanConverter })];
            _onChange_decorators = [bound];
            __esDecorate(this, null, _input_decorators, { kind: "accessor", name: "input", static: false, private: false, access: { has: obj => "input" in obj, get: obj => obj.input, set: (obj, value) => { obj.input = value; } }, metadata: _metadata }, _input_initializers, _input_extraInitializers);
            __esDecorate(this, null, _set_value_decorators, { kind: "setter", name: "value", static: false, private: false, access: { has: obj => "value" in obj, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(this, null, _onChange_decorators, { kind: "method", name: "onChange", static: false, private: false, access: { has: obj => "onChange" in obj, get: obj => obj.onChange }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static Tag = "elysia-boolean";
        static styles = css `
        input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            position: relative;
            font-size: inherit;
            width: 3rem;
            height: 1.5rem;
            box-sizing: content-box;
            border-radius: 1rem;
            vertical-align: text-bottom;
            margin: auto;
            color: inherit;
            background-color: var(--elysia-color-aro);
			cursor: pointer;

            &::before {
                content: "";
                position: absolute;
                top: 50%;
                left: 0;
                transform: translate(0, -50%);
                transition: all 0.2s ease;
                box-sizing: border-box;
                width: 1.3rem;
                height: 1.3rem;
                margin: 0 0.125rem;
                border-radius: 50%;
                background: var(--elysia-color-voncount);
            }

            &:checked {
                background: var(--elysia-color-voncount);
            }

            &:checked::before {
                left: 1.45rem;
                background-color: var(--elysia-color-cullen);
            }
        }
	`;
        #input_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _input_initializers, null));
        get input() { return this.#input_accessor_storage; }
        set input(value) { this.#input_accessor_storage = value; }
        get value() { return this.#internalValue; }
        set value(val) {
            if (typeof val === undefined) {
                this.controlled = false;
                this.#internalValue = !!this.input?.checked;
            }
            else {
                this.controlled = true;
                this.#internalValue = BooleanConverter(val);
                if (this.input)
                    this.input.checked = BooleanConverter(val);
            }
        }
        #defaultValue_accessor_storage = (__runInitializers(this, _input_extraInitializers), __runInitializers(this, _defaultValue_initializers, false));
        get defaultValue() { return this.#defaultValue_accessor_storage; }
        set defaultValue(value) { this.#defaultValue_accessor_storage = value; }
        controlled = (__runInitializers(this, _defaultValue_extraInitializers), false);
        onMount() {
            if (typeof this.value !== "undefined") {
                this.controlled = true;
                this.#internalValue = toBoolean(this.value);
            }
            else {
                this.value = this.defaultValue;
                this.controlled = false;
            }
        }
        onRender() {
            return html `<input id="input" type="checkbox" .checked="${this.#internalValue}" @change=${this.onChange}>`;
        }
        onChange(e) {
            const val = e.target.checked;
            if (this.controlled)
                this.input.checked = !!this.value;
            else
                this.#internalValue = e.target.checked;
            this.dispatchEvent(new CustomEvent("change", { detail: val }));
        }
        #internalValue = false;
    };
})();
export { ElysiaBoolean };
defineComponent(ElysiaBoolean);
