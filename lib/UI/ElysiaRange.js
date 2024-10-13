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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { attribute, css, defineComponent, ElysiaElement, html } from "./UI";
let ElysiaRange = (() => {
    let _classSuper = ElysiaElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _min_decorators;
    let _min_initializers = [];
    let _min_extraInitializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _max_extraInitializers = [];
    let _step_decorators;
    let _step_initializers = [];
    let _step_extraInitializers = [];
    return class ElysiaRange extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [attribute()];
            _min_decorators = [attribute()];
            _max_decorators = [attribute()];
            _step_decorators = [attribute()];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } }, metadata: _metadata }, _min_initializers, _min_extraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } }, metadata: _metadata }, _max_initializers, _max_extraInitializers);
            __esDecorate(this, null, _step_decorators, { kind: "accessor", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step, set: (obj, value) => { obj.step = value; } }, metadata: _metadata }, _step_initializers, _step_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static Tag = "elysia-range";
        static styles = css `
        .slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            cursor: pointer;
            outline: none;
            overflow: hidden;
            border-radius: 16px;
        }

        .slider::-webkit-slider-runnable-track {
            height: 20px;
            background: var(--elysia-color-aro);
            border-radius: 16px;
        }

        .slider::-moz-range-track {
            height: 25px;
            background: var(--elysia-color-aro);
            border-radius: 16px;
        }

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 20px;
            width: 20px;
            background-color: var(--elysia-color-cullen);
            border-radius: 50%;
            border: 2px solid var(--elysia-color-aro);
            box-shadow: -9999px 0 0 9990px var(--elysia-color-aro);
        }

        .slider::-moz-range-thumb {
            height: 25px;
            width: 25px;
            background-color: var(--elysia-color-foreground);
            border-radius: 50%;
            border: 1px solid var(--elysia-color-selection);
            box-shadow: -9997px 0 0 9990px var(--elysia-color-selection);
        }

        .value-wrap {
            display: flex;
            justify-content: space-between;
            margin-top: 0.5rem;
            font-family: var(--elysia-font-family);
            font-size: .5rem;
        }

        .val {
            font-size: .75rem;
            color: var(--elysia-color-purple);
        }
	`;
        #value_accessor_storage = __runInitializers(this, _value_initializers, "0");
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #min_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _min_initializers, "0"));
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        #max_accessor_storage = (__runInitializers(this, _min_extraInitializers), __runInitializers(this, _max_initializers, "100"));
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #step_accessor_storage = (__runInitializers(this, _max_extraInitializers), __runInitializers(this, _step_initializers, "1"));
        get step() { return this.#step_accessor_storage; }
        set step(value) { this.#step_accessor_storage = value; }
        onChange = __runInitializers(this, _step_extraInitializers);
        onRender() {
            return html `
			<div>
				<div class="value-wrap">
					<span>${this.min}</span>
					<span class="val">${this.value}</span>
					<span>${this.max}</span>
				</div>
				<input
						type="range"
						value="${this.value}"
						min="${this.min}"
						max="${this.max}"
						step="${this.step}"
						class="slider"
						@input=${this.#onInput}
				>
			</div>

		`;
        }
        #onInput(e) {
            const value = e.target.value;
            this.value = value;
            if (this.onChange)
                this.onChange(Number(value));
        }
    };
})();
export { ElysiaRange };
defineComponent(ElysiaRange);
