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
import { attribute, BooleanConverter, css, defineComponent, ElysiaElement, html } from "./UI.js";
import { query } from "lit/decorators.js";
import { bound, toBoolean } from "../Core/Utilities.js";
let ElysiaBoolean = (() => {
    var _a, _ElysiaBoolean_internalValue, _ElysiaBoolean_input_accessor_storage, _ElysiaBoolean_defaultValue_accessor_storage;
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
    return _a = class ElysiaBoolean extends _classSuper {
            constructor() {
                super(...arguments);
                _ElysiaBoolean_input_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _input_initializers, null)));
                _ElysiaBoolean_defaultValue_accessor_storage.set(this, (__runInitializers(this, _input_extraInitializers), __runInitializers(this, _defaultValue_initializers, false)));
                Object.defineProperty(this, "controlled", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: (__runInitializers(this, _defaultValue_extraInitializers), false)
                });
                _ElysiaBoolean_internalValue.set(this, false);
            }
            get input() { return __classPrivateFieldGet(this, _ElysiaBoolean_input_accessor_storage, "f"); }
            set input(value) { __classPrivateFieldSet(this, _ElysiaBoolean_input_accessor_storage, value, "f"); }
            get value() { return __classPrivateFieldGet(this, _ElysiaBoolean_internalValue, "f"); }
            set value(val) {
                if (typeof val === undefined) {
                    this.controlled = false;
                    __classPrivateFieldSet(this, _ElysiaBoolean_internalValue, !!this.input?.checked, "f");
                }
                else {
                    this.controlled = true;
                    __classPrivateFieldSet(this, _ElysiaBoolean_internalValue, BooleanConverter(val), "f");
                    if (this.input)
                        this.input.checked = BooleanConverter(val);
                }
            }
            get defaultValue() { return __classPrivateFieldGet(this, _ElysiaBoolean_defaultValue_accessor_storage, "f"); }
            set defaultValue(value) { __classPrivateFieldSet(this, _ElysiaBoolean_defaultValue_accessor_storage, value, "f"); }
            onMount() {
                if (typeof this.value !== "undefined") {
                    this.controlled = true;
                    __classPrivateFieldSet(this, _ElysiaBoolean_internalValue, toBoolean(this.value), "f");
                }
                else {
                    this.value = this.defaultValue;
                    this.controlled = false;
                }
            }
            onRender() {
                return html `<input id="input" type="checkbox" .checked="${__classPrivateFieldGet(this, _ElysiaBoolean_internalValue, "f")}" @change=${this.onChange}>`;
            }
            onChange(e) {
                const val = e.target.checked;
                if (this.controlled)
                    this.input.checked = !!this.value;
                else
                    __classPrivateFieldSet(this, _ElysiaBoolean_internalValue, e.target.checked, "f");
                this.dispatchEvent(new CustomEvent("change", { detail: val }));
            }
        },
        _ElysiaBoolean_internalValue = new WeakMap(),
        _ElysiaBoolean_input_accessor_storage = new WeakMap(),
        _ElysiaBoolean_defaultValue_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _input_decorators = [query("#input")];
            _set_value_decorators = [attribute()];
            _defaultValue_decorators = [attribute({ converter: BooleanConverter })];
            _onChange_decorators = [bound];
            __esDecorate(_a, null, _input_decorators, { kind: "accessor", name: "input", static: false, private: false, access: { has: obj => "input" in obj, get: obj => obj.input, set: (obj, value) => { obj.input = value; } }, metadata: _metadata }, _input_initializers, _input_extraInitializers);
            __esDecorate(_a, null, _set_value_decorators, { kind: "setter", name: "value", static: false, private: false, access: { has: obj => "value" in obj, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(_a, null, _onChange_decorators, { kind: "method", name: "onChange", static: false, private: false, access: { has: obj => "onChange" in obj, get: obj => obj.onChange }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        Object.defineProperty(_a, "Tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "elysia-boolean"
        }),
        Object.defineProperty(_a, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: css `
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
	`
        }),
        _a;
})();
export { ElysiaBoolean };
defineComponent(ElysiaBoolean);
