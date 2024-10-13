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
import { css, defineComponent, ElysiaElement, html } from "./UI";
import "corel-color-picker/corel-color-picker.js";
import { query } from "lit/decorators.js";
let ElysiaColorPicker = (() => {
    let _classSuper = ElysiaElement;
    let _picker_decorators;
    let _picker_initializers = [];
    let _picker_extraInitializers = [];
    return class ElysiaColorPicker extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _picker_decorators = [query("#picker")];
            __esDecorate(this, null, _picker_decorators, { kind: "accessor", name: "picker", static: false, private: false, access: { has: obj => "picker" in obj, get: obj => obj.picker, set: (obj, value) => { obj.picker = value; } }, metadata: _metadata }, _picker_initializers, _picker_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static Tag = "elysia-color-picker";
        static styles = css `
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
	`;
        #picker_accessor_storage = __runInitializers(this, _picker_initializers, null);
        get picker() { return this.#picker_accessor_storage; }
        set picker(value) { this.#picker_accessor_storage = value; }
        open = (__runInitializers(this, _picker_extraInitializers), false);
        color = "#FF55A7";
        onRender() {
            return html `
			<button popovertarget="swatch" style=${`background: ${this.color}`}></button>
			<div id="swatch" popover>
				<div class="flexer">
					<div class="color-text">color</div>
					<div class="color-text" style=${`color: ${this.color}`}>${this.color}</div>
				</div>
				<corel-color-picker id="picker" @change=${this.#onInput} value=${this.color}>
					<corel-color-picker>
			</div>
		`;
        }
        #onInput = (e) => {
            this.color = this.picker.value;
        };
    };
})();
export { ElysiaColorPicker };
defineComponent(ElysiaColorPicker);
