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
import { css, defineComponent, ElysiaElement, html } from "./UI.js";
import "corel-color-picker/corel-color-picker.js";
import { query } from "lit/decorators.js";
let ElysiaColorPicker = (() => {
    var _a, _ElysiaColorPicker_onInput, _ElysiaColorPicker_picker_accessor_storage;
    let _classSuper = ElysiaElement;
    let _picker_decorators;
    let _picker_initializers = [];
    let _picker_extraInitializers = [];
    return _a = class ElysiaColorPicker extends _classSuper {
            constructor() {
                super(...arguments);
                _ElysiaColorPicker_picker_accessor_storage.set(this, __runInitializers(this, _picker_initializers, null));
                Object.defineProperty(this, "open", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: (__runInitializers(this, _picker_extraInitializers), false)
                });
                Object.defineProperty(this, "color", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: "#FF55A7"
                });
                _ElysiaColorPicker_onInput.set(this, (e) => {
                    this.color = this.picker.value;
                });
            }
            get picker() { return __classPrivateFieldGet(this, _ElysiaColorPicker_picker_accessor_storage, "f"); }
            set picker(value) { __classPrivateFieldSet(this, _ElysiaColorPicker_picker_accessor_storage, value, "f"); }
            onRender() {
                return html `
			<button popovertarget="swatch" style=${`background: ${this.color}`}></button>
			<div id="swatch" popover>
				<div class="flexer">
					<div class="color-text">color</div>
					<div class="color-text" style=${`color: ${this.color}`}>${this.color}</div>
				</div>
				<corel-color-picker id="picker" @change=${__classPrivateFieldGet(this, _ElysiaColorPicker_onInput, "f")} value=${this.color}>
					<corel-color-picker>
			</div>
		`;
            }
        },
        _ElysiaColorPicker_onInput = new WeakMap(),
        _ElysiaColorPicker_picker_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _picker_decorators = [query("#picker")];
            __esDecorate(_a, null, _picker_decorators, { kind: "accessor", name: "picker", static: false, private: false, access: { has: obj => "picker" in obj, get: obj => obj.picker, set: (obj, value) => { obj.picker = value; } }, metadata: _metadata }, _picker_initializers, _picker_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        Object.defineProperty(_a, "Tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "elysia-color-picker"
        }),
        Object.defineProperty(_a, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: css `
        button {
            padding: 1.25em 1.25em;
            border: none;
            border-radius: 1rem;
            user-select: none;
        }

        #swatch {
            background: var(--elysia-color-aro);
            border: none;
            border-radius: 12px;
            padding: 1rem;
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            border: 1px solid var(--elysia-color-voncount);
        }

        .color-text {
            font-family: var(--elysia-font-family);
            font-size: 0.75rem;
            color: var(--elysia-color-pink)
        }

        .flexer {
            display: flex;
            justify-content: space-between;
        }

        button {
            cursor: pointer;
        }
	`
        }),
        _a;
})();
export { ElysiaColorPicker };
defineComponent(ElysiaColorPicker);
