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
import { query } from "lit/decorators.js";
import logo_transparent from "../../assets/logo_transparent.js";
let ElysiaSplash = (() => {
    var _a, _ElysiaSplash_container_accessor_storage;
    let _classSuper = ElysiaElement;
    let _container_decorators;
    let _container_initializers = [];
    let _container_extraInitializers = [];
    return _a = class ElysiaSplash extends _classSuper {
            constructor() {
                super(...arguments);
                _ElysiaSplash_container_accessor_storage.set(this, __runInitializers(this, _container_initializers, void 0));
                Object.defineProperty(this, "mountedAt", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: (__runInitializers(this, _container_extraInitializers), 0)
                });
                Object.defineProperty(this, "goodbye", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: () => {
                        let timeRemaining = 3000 - (performance.now() - this.mountedAt);
                        if (timeRemaining < 0)
                            timeRemaining = 0;
                        this.style.opacity = "0";
                        this.style.pointerEvents = "none";
                        setTimeout(() => super.remove(), timeRemaining);
                    }
                });
            }
            get container() { return __classPrivateFieldGet(this, _ElysiaSplash_container_accessor_storage, "f"); }
            set container(value) { __classPrivateFieldSet(this, _ElysiaSplash_container_accessor_storage, value, "f"); }
            onMount() {
                this.mountedAt = performance.now();
                setTimeout(() => this.container.style.opacity = "1", 500);
            }
            onRender() {
                return html `
			<div id="container">
				<img id="img" src="${logo_transparent}">
				<div id="text">ELYSIA ENGINE</div>
			</div>
		`;
            }
        },
        _ElysiaSplash_container_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _container_decorators = [query("#container")];
            __esDecorate(_a, null, _container_decorators, { kind: "accessor", name: "container", static: false, private: false, access: { has: obj => "container" in obj, get: obj => obj.container, set: (obj, value) => { obj.container = value; } }, metadata: _metadata }, _container_initializers, _container_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        Object.defineProperty(_a, "Tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "elysia-splash"
        }),
        Object.defineProperty(_a, "ManualTracking", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        }),
        Object.defineProperty(_a, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: css `
		:host {
			z-index: 10000;
			position: absolute;
			inset: 0;
			background: #EBEAEC;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #44475A;
			font-family: 'Kode Mono', serif;
			transition: opacity 1s ease-out;
		}
		
		#container {
            display: flex;
            justify-content: center;
            align-items: center;
			flex-direction: column;
            opacity: 0;
            transition: opacity 1s ease-in-out;
		}

		img {
			width: 50vw
		}
	`
        }),
        _a;
})();
export { ElysiaSplash };
defineComponent(ElysiaSplash);
