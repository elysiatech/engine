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
import { bound } from "../Core/Utilities";
let ElysiaVector = (() => {
    let _classSuper = ElysiaElement;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _createElement_decorators;
    let _onInput_decorators;
    return class ElysiaVector extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [attribute({ converter: (v) => (console.log(v), JSON.parse(v)) })];
            _createElement_decorators = [bound];
            _onInput_decorators = [bound];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _createElement_decorators, { kind: "method", name: "createElement", static: false, private: false, access: { has: obj => "createElement" in obj, get: obj => obj.createElement }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _onInput_decorators, { kind: "method", name: "onInput", static: false, private: false, access: { has: obj => "onInput" in obj, get: obj => obj.onInput }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static Tag = "elysia-vector";
        static styles = css `
		:host {
			display: flex;
			gap: 4px;
		}

        elysia-number-input::part(input) {
            max-width: 50px;
        }

		.title {
			position: absolute;
			right: 8px;
			pointer-events: none;
			top: 50%;
			transform: translateY(-50%);
            font-size: .75rem;
            color: var(--elysia-color-purple);
		}

		.vec {
			position: relative;
		}
	`;
        #value_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _value_initializers, { x: 0, y: 0, z: 0, w: 12 }));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        onRender() {
            return html `${Object.keys(this.value).map(this.createElement)}`;
        }
        createElement(name) {
            return html `
			<div class="vec">
				<div class="title">${name}</div>
				<elysia-number-input value=${this.value[name]} @change=${(e) => this.onInput(name, e)}></elysia-number-input>
			</div>
		`;
        }
        onInput(name, e) {
            this.value[name] = e.detail;
            console.log(this.value);
            this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _value_extraInitializers);
        }
    };
})();
export { ElysiaVector };
defineComponent(ElysiaVector);
