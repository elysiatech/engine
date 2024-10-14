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
let ElysiaEnum = (() => {
    var _a, _ElysiaEnum_onChange, _ElysiaEnum_value_accessor_storage, _ElysiaEnum_options_accessor_storage;
    let _classSuper = ElysiaElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _options_decorators;
    let _options_initializers = [];
    let _options_extraInitializers = [];
    return _a = class ElysiaEnum extends _classSuper {
            constructor() {
                super(...arguments);
                _ElysiaEnum_value_accessor_storage.set(this, __runInitializers(this, _value_initializers, ""));
                _ElysiaEnum_options_accessor_storage.set(this, (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _options_initializers, [
                    "Option 1",
                    "Option 2",
                    "Option 3"
                ])));
                Object.defineProperty(this, "onChange", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: __runInitializers(this, _options_extraInitializers)
                });
                _ElysiaEnum_onChange.set(this, (e) => {
                    this.value = e.target.value;
                    if (this.onChange)
                        this.onChange(this.value);
                });
            }
            get value() { return __classPrivateFieldGet(this, _ElysiaEnum_value_accessor_storage, "f"); }
            set value(value) { __classPrivateFieldSet(this, _ElysiaEnum_value_accessor_storage, value, "f"); }
            get options() { return __classPrivateFieldGet(this, _ElysiaEnum_options_accessor_storage, "f"); }
            set options(value) { __classPrivateFieldSet(this, _ElysiaEnum_options_accessor_storage, value, "f"); }
            onRender() {
                return html `
			<select @change=${__classPrivateFieldGet(this, _ElysiaEnum_onChange, "f")}>
				${this.options.map(option => html `<option value="${option}" ?selected=${option === this.value}>${option}</option>`)}
			</select>
		`;
            }
        },
        _ElysiaEnum_onChange = new WeakMap(),
        _ElysiaEnum_value_accessor_storage = new WeakMap(),
        _ElysiaEnum_options_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [attribute()];
            _options_decorators = [attribute()];
            __esDecorate(_a, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(_a, null, _options_decorators, { kind: "accessor", name: "options", static: false, private: false, access: { has: obj => "options" in obj, get: obj => obj.options, set: (obj, value) => { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        Object.defineProperty(_a, "Tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "elysia-enum"
        }),
        Object.defineProperty(_a, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: css `
		select {
			padding: 0.5em 1em 0.5em 1em;
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
		}
	`
        }),
        _a;
})();
export { ElysiaEnum };
defineComponent(ElysiaEnum);
