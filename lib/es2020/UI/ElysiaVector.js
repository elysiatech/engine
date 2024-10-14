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
import { attribute, css, defineComponent, ElysiaElement, html } from "./UI.js";
import { bound } from "../Core/Utilities.js";
let ElysiaVector = (() => {
    var _a, _ElysiaVector_value_accessor_storage;
    let _classSuper = ElysiaElement;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _createElement_decorators;
    let _onInput_decorators;
    return _a = class ElysiaVector extends _classSuper {
            get value() { return __classPrivateFieldGet(this, _ElysiaVector_value_accessor_storage, "f"); }
            set value(value) { __classPrivateFieldSet(this, _ElysiaVector_value_accessor_storage, value, "f"); }
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
                _ElysiaVector_value_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _value_initializers, { x: 0, y: 0, z: 0, w: 12 })));
                __runInitializers(this, _value_extraInitializers);
            }
        },
        _ElysiaVector_value_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [attribute({ converter: (v) => (console.log(v), JSON.parse(v)) })];
            _createElement_decorators = [bound];
            _onInput_decorators = [bound];
            __esDecorate(_a, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(_a, null, _createElement_decorators, { kind: "method", name: "createElement", static: false, private: false, access: { has: obj => "createElement" in obj, get: obj => obj.createElement }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onInput_decorators, { kind: "method", name: "onInput", static: false, private: false, access: { has: obj => "onInput" in obj, get: obj => obj.onInput }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        Object.defineProperty(_a, "Tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "elysia-vector"
        }),
        Object.defineProperty(_a, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: css `
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
	`
        }),
        _a;
})();
export { ElysiaVector };
defineComponent(ElysiaVector);
