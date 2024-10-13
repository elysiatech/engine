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
import { attribute, css, defineComponent, ElysiaElement, html } from "./UI";
import { query } from "lit/decorators.js";
import { bound } from "../Core/Utilities";
let ElysiaNumberInput = (() => {
    let _classSuper = ElysiaElement;
    let _instanceExtraInitializers = [];
    let _input_decorators;
    let _input_initializers = [];
    let _input_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _min_decorators;
    let _min_initializers = [];
    let _min_extraInitializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _max_extraInitializers = [];
    let _step_decorators;
    let _step_initializers = [];
    let _step_extraInitializers = [];
    let _onChange_decorators;
    return class ElysiaNumberInput extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _input_decorators = [query("#input")];
            _value_decorators = [attribute({ type: Number })];
            _defaultValue_decorators = [attribute({ type: Number })];
            _min_decorators = [attribute()];
            _max_decorators = [attribute()];
            _step_decorators = [attribute({ type: Number })];
            _onChange_decorators = [bound];
            __esDecorate(this, null, _input_decorators, { kind: "accessor", name: "input", static: false, private: false, access: { has: obj => "input" in obj, get: obj => obj.input, set: (obj, value) => { obj.input = value; } }, metadata: _metadata }, _input_initializers, _input_extraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } }, metadata: _metadata }, _min_initializers, _min_extraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } }, metadata: _metadata }, _max_initializers, _max_extraInitializers);
            __esDecorate(this, null, _step_decorators, { kind: "accessor", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step, set: (obj, value) => { obj.step = value; } }, metadata: _metadata }, _step_initializers, _step_extraInitializers);
            __esDecorate(this, null, _onChange_decorators, { kind: "method", name: "onChange", static: false, private: false, access: { has: obj => "onChange" in obj, get: obj => obj.onChange }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static Tag = "elysia-number-input";
        static styles = css `
        input {
            padding: 0.5em 1em;
            background-color: var(--elysia-color-aro);
            border: 1px solid var(--elysia-color-purple);
            color: var(--elysia-color-cullen);
            border-radius: 1rem;
            transition: all 0.1s;
            user-select: none;
            font-family: var(--elysia-font-family);

            &:hover {
                cursor: pointer;
                background-color: oklch(from var(--elysia-color-aro) calc(l * 1.1) c h);
            }

            &:active {
                background-color: oklch(from var(--elysia-color-aro) calc(l * 1.2) c h);
            }

            &:focus {
                outline: none;
            }

            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button {
                -webkit-appearance: none;
            }

            &[type=number] {
                -moz-appearance: textfield;
            }

            &:invalid {
                background-color: oklch(from var(--elysia-color-red) calc(l * 1.15) c h);
            }
        }
	`;
        #input_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _input_initializers, null));
        get input() { return this.#input_accessor_storage; }
        set input(value) { this.#input_accessor_storage = value; }
        #value_accessor_storage = (__runInitializers(this, _input_extraInitializers), __runInitializers(this, _value_initializers, void 0));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #defaultValue_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _defaultValue_initializers, 0));
        get defaultValue() { return this.#defaultValue_accessor_storage; }
        set defaultValue(value) { this.#defaultValue_accessor_storage = value; }
        #min_accessor_storage = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _min_initializers, "-Infinity"));
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        #max_accessor_storage = (__runInitializers(this, _min_extraInitializers), __runInitializers(this, _max_initializers, "Infinity"));
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #step_accessor_storage = (__runInitializers(this, _max_extraInitializers), __runInitializers(this, _step_initializers, 0.1));
        get step() { return this.#step_accessor_storage; }
        set step(value) { this.#step_accessor_storage = value; }
        controlled = (__runInitializers(this, _step_extraInitializers), false);
        onMount() { if (typeof this.value !== "undefined")
            this.controlled = true; }
        onRender() {
            return html `
			<input
					part="input"
					id="input"
					type="number"
					.value=${this.controlled}
					min=${this.min}
					max=${this.max}
					step=${this.step}
					@mousedown=${this.onMouseDown}
					@change=${this.onChange}
			>
		`;
        }
        initialMousePos = { x: 0, y: 0 };
        onMouseDown = (e) => {
            const bounds = this.input?.getBoundingClientRect();
            if (bounds && e.clientX < bounds.left + bounds.width * 0.5)
                return;
            this.initialMousePos = { x: e.clientX, y: e.clientY };
            window.addEventListener("mousemove", this.onMouseDrag);
            window.addEventListener("mouseup", this.onMouseUp);
        };
        onMouseDrag = (e) => {
            e.stopPropagation();
            const step = Number(this.step);
            const value = Number(this.value) + Math.round(e.clientX - this.initialMousePos.x) * step;
            const final = Number(Math.min(Math.max(value, Number(this.min)), Number(this.max)).toFixed(2));
            if (this.controlled)
                this.input.value = String(value);
            else
                this.value = final;
            this.dispatchEvent(new CustomEvent("change", { detail: final }));
            this.initialMousePos = { x: e.clientX, y: e.clientY };
        };
        onMouseUp = () => {
            window.removeEventListener("mousemove", this.onMouseDrag);
            window.removeEventListener("mouseup", this.onMouseUp);
        };
        onChange(e) {
            const val = this.input.value;
            if (this.controlled)
                this.input.value = val;
            else
                this.value = Number(val);
            this.dispatchEvent(new CustomEvent("change", { detail: val }));
        }
    };
})();
export { ElysiaNumberInput };
defineComponent(ElysiaNumberInput);
