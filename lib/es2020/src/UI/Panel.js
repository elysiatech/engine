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
var _DraggableController_instances, _DraggableController_handle_get, _DraggableController_handle_set, _DraggableController_onDragStart, _DraggableController_onDragMove, _DraggableController_onDragEnd, _DraggableController_onWindowResize, _DraggableController_handle_accessor_storage, _CollapsableController_container, _CollapsableController_trigger, _CollapsableController_startPosition, _CollapsableController_onMouseDown, _CollapsableController_onMouseUp;
import { css, defineComponent, ElysiaElement, html } from "./UI.js";
import { query } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";
import "./Widgets";
export class DraggableController {
    constructor(host) {
        _DraggableController_instances.add(this);
        Object.defineProperty(this, "host", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: host
        });
        Object.defineProperty(this, "mouseDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "dragging", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "start", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0 }
        });
        Object.defineProperty(this, "offset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0 }
        });
        Object.defineProperty(this, "last", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0 }
        });
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        _DraggableController_handle_accessor_storage.set(this, void 0);
        _DraggableController_onDragStart.set(this, (e) => {
            this.mouseDown = true;
            this.offset = {
                x: e.clientX - this.x,
                y: e.clientY - this.y,
            };
            this.start = {
                x: e.clientX - this.offset.x,
                y: e.clientY - this.offset.y,
            };
            window.addEventListener("mousemove", __classPrivateFieldGet(this, _DraggableController_onDragMove, "f"));
            window.addEventListener("mouseup", __classPrivateFieldGet(this, _DraggableController_onDragEnd, "f"));
        });
        _DraggableController_onDragMove.set(this, (e) => {
            if (!this.mouseDown)
                return;
            if (!this.dragging)
                this.dragging = true;
            // want to constrain the s_Parent bounds to the window
            const bounds = this.host.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - this.offset.x, window.innerWidth - bounds.width));
            const y = Math.max(0, Math.min(e.clientY - this.offset.y, window.innerHeight - bounds.height));
            this.x = x;
            this.y = y;
            this.last = { x, y };
            this.host.style.transform = `translate(${this.x}px, ${this.y}px)`;
        });
        _DraggableController_onDragEnd.set(this, () => {
            this.dragging = false;
            this.mouseDown = false;
            window.removeEventListener("mousemove", __classPrivateFieldGet(this, _DraggableController_onDragMove, "f"));
            window.removeEventListener("mouseup", __classPrivateFieldGet(this, _DraggableController_onDragEnd, "f"));
        });
        _DraggableController_onWindowResize.set(this, () => {
            const bounds = this.host.getBoundingClientRect();
            const x = Math.max(0, Math.min(this.last.x, window.innerWidth - bounds.width));
            const y = Math.max(0, Math.min(this.last.y, window.innerHeight - bounds.height));
            this.x = x;
            this.y = y;
            this.host.style.transform = `translate(${this.x}px, ${this.y}px)`;
        });
        host.addController(this);
        this.bindHandle = this.bindHandle.bind(this);
        this.hostConnected = this.hostConnected.bind(this);
        this.hostDisconnected = this.hostDisconnected.bind(this);
        this.hostUpdated = this.hostUpdated.bind(this);
    }
    bindHandle() {
        return ref((childContainer) => {
            if (!childContainer)
                return;
            __classPrivateFieldSet(this, _DraggableController_instances, childContainer, "a", _DraggableController_handle_set);
        });
    }
    hostConnected() { window.addEventListener("resize", __classPrivateFieldGet(this, _DraggableController_onWindowResize, "f")); }
    hostDisconnected() { window.removeEventListener("resize", __classPrivateFieldGet(this, _DraggableController_onWindowResize, "f")); }
    hostUpdated() { __classPrivateFieldGet(this, _DraggableController_instances, "a", _DraggableController_handle_get)?.addEventListener("mousedown", __classPrivateFieldGet(this, _DraggableController_onDragStart, "f")); }
}
_DraggableController_onDragStart = new WeakMap(), _DraggableController_onDragMove = new WeakMap(), _DraggableController_onDragEnd = new WeakMap(), _DraggableController_onWindowResize = new WeakMap(), _DraggableController_instances = new WeakSet(), _DraggableController_handle_accessor_storage = new WeakMap(), _DraggableController_handle_get = function _DraggableController_handle_get() { return __classPrivateFieldGet(this, _DraggableController_handle_accessor_storage, "f"); }, _DraggableController_handle_set = function _DraggableController_handle_set(value) { __classPrivateFieldSet(this, _DraggableController_handle_accessor_storage, value, "f"); };
export class CollapsableController {
    constructor(host) {
        Object.defineProperty(this, "host", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: host
        });
        Object.defineProperty(this, "isOpen", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        _CollapsableController_container.set(this, void 0);
        _CollapsableController_trigger.set(this, void 0);
        _CollapsableController_startPosition.set(this, { x: 0, y: 0 });
        _CollapsableController_onMouseDown.set(this, (e) => { __classPrivateFieldSet(this, _CollapsableController_startPosition, { x: e.clientX, y: e.clientY }, "f"); });
        _CollapsableController_onMouseUp.set(this, (e) => {
            if (__classPrivateFieldGet(this, _CollapsableController_startPosition, "f").x !== e.clientX || __classPrivateFieldGet(this, _CollapsableController_startPosition, "f").y !== e.clientY)
                return;
            this.toggle();
        });
        host.addController(this);
        this.hostConnected = this.hostConnected.bind(this);
        this.bindTrigger = this.bindTrigger.bind(this);
        this.bindContainer = this.bindContainer.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    hostConnected() { }
    bindTrigger() {
        return ref((trigger) => {
            if (!trigger)
                return;
            __classPrivateFieldSet(this, _CollapsableController_trigger, trigger, "f");
            __classPrivateFieldGet(this, _CollapsableController_trigger, "f").addEventListener("mousedown", __classPrivateFieldGet(this, _CollapsableController_onMouseDown, "f"));
            __classPrivateFieldGet(this, _CollapsableController_trigger, "f").addEventListener("mouseup", __classPrivateFieldGet(this, _CollapsableController_onMouseUp, "f"));
        });
    }
    bindContainer() {
        return ref((container) => {
            if (!container)
                return;
            __classPrivateFieldSet(this, _CollapsableController_container, container, "f");
        });
    }
    open({ immediate = false } = {}) {
        if (this.isOpen)
            return;
        const oldRootHeight = this.host.getBoundingClientRect().height;
        this.host.style.height = `auto`;
        const newRootHeight = this.host.getBoundingClientRect().height;
        const anim = this.host.animate({ height: [`${oldRootHeight}px`, `${newRootHeight}px`] }, {
            duration: immediate ? 0 : (newRootHeight - oldRootHeight) * .5,
            easing: "ease-in-out",
            fill: "forwards",
        });
        anim.finished.then(() => {
            anim.commitStyles();
            anim.cancel();
            this.isOpen = true;
        });
    }
    close({ immediate = false } = {}) {
        if (!this.isOpen)
            return;
        const oldRootHeight = this.host.getBoundingClientRect().height;
        const containerDisplay = __classPrivateFieldGet(this, _CollapsableController_container, "f").style.display;
        __classPrivateFieldGet(this, _CollapsableController_container, "f").style.display = "none";
        this.host.style.height = 'auto';
        const newRootHeight = this.host.getBoundingClientRect().height;
        __classPrivateFieldGet(this, _CollapsableController_container, "f").style.display = containerDisplay;
        const anim = this.host.animate({ height: [`${oldRootHeight}px`, `${newRootHeight}px`] }, {
            duration: immediate ? 0 : (oldRootHeight - newRootHeight) * .5,
            easing: "ease-in-out",
            fill: "forwards",
        });
        anim.finished.then(() => {
            anim.commitStyles();
            anim.cancel();
            this.isOpen = false;
        });
    }
    toggle({ immediate = false } = {}) {
        if (this.isOpen)
            this.close({ immediate });
        else
            this.open({ immediate });
    }
}
_CollapsableController_container = new WeakMap(), _CollapsableController_trigger = new WeakMap(), _CollapsableController_startPosition = new WeakMap(), _CollapsableController_onMouseDown = new WeakMap(), _CollapsableController_onMouseUp = new WeakMap();
let ElysiaFloatingPanel = (() => {
    var _a, _ElysiaFloatingPanel_header_accessor_storage;
    let _classSuper = ElysiaElement;
    let _header_decorators;
    let _header_initializers = [];
    let _header_extraInitializers = [];
    return _a = class ElysiaFloatingPanel extends _classSuper {
            get header() { return __classPrivateFieldGet(this, _ElysiaFloatingPanel_header_accessor_storage, "f"); }
            set header(value) { __classPrivateFieldSet(this, _ElysiaFloatingPanel_header_accessor_storage, value, "f"); }
            constructor() {
                super();
                _ElysiaFloatingPanel_header_accessor_storage.set(this, __runInitializers(this, _header_initializers, null));
                Object.defineProperty(this, "dragger", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: __runInitializers(this, _header_extraInitializers)
                });
                Object.defineProperty(this, "dropper", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.dragger = new DraggableController(this);
                this.dropper = new CollapsableController(this);
            }
            onRender() {
                return html `
			<div
				class="header"
				${this.dragger.bindHandle()}
				${this.dropper.bindTrigger()}
			>
				<slot name="header"></slot>
			</div>
			<div
				class="body"
				${this.dropper.bindContainer()}
			>
				<slot name="body"></slot>
			</div>
		`;
            }
        },
        _ElysiaFloatingPanel_header_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _header_decorators = [query('.header')];
            __esDecorate(_a, null, _header_decorators, { kind: "accessor", name: "header", static: false, private: false, access: { has: obj => "header" in obj, get: obj => obj.header, set: (obj, value) => { obj.header = value; } }, metadata: _metadata }, _header_initializers, _header_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        Object.defineProperty(_a, "Tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'elysia-floating-panel'
        }),
        Object.defineProperty(_a, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: css `
		:host {
            position: fixed;
			top: 24px;
			right: 24px;
			background: var(--elysia-color-nosferatu);
			border: 1px solid var(--elysia-color-voncount);
			color: var(--elysia-color-cullen);
			border-radius: 4px;
			z-index: 1000;
			overflow: hidden;
            min-width: 300px;
			font-family: var(--elysia-font-family);
			filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
		}

		.header {
			background: var(--elysia-color-aro);
			color: var(--elysia-color-purple);
			padding: 8px;
			user-select: none;
            -webkit-user-select: none;
			cursor: grab;
		}

		.body {
			padding: 8px;
			max-height: 85vh;
			overflow: scroll;
		}
	`
        }),
        _a;
})();
export { ElysiaFloatingPanel };
defineComponent(ElysiaFloatingPanel);
export class ElysiaFloatingPanelTest extends ElysiaElement {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "vec", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 4, y: 2 }
        });
        Object.defineProperty(this, "number", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5
        });
        Object.defineProperty(this, "bool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    onRender() {
        return html `
			<elysia-floating-panel>
				<div class="header" slot="header">Header</div>
				<div class="body" slot="body">
					<elysia-button @click=${() => console.log("clicked")}>Click me</elysia-button>
					<elysia-number-input .value=${this.number}></elysia-number-input>
					<elysia-text-input>hello world</elysia-text-input>
					<elysia-boolean @_change=${(e) => this.bool = e.detail} _value=${this.bool}></elysia-boolean>
					<elysia-range></elysia-range>
					<elysia-vector .value=${this.vec} @change=${(v) => this.vec = v.detail}></elysia-vector>
					<elysia-enum></elysia-enum>
					<elysia-color-picker></elysia-color-picker>
				</div>
			</elysia-floating-panel>
		`;
    }
}
Object.defineProperty(ElysiaFloatingPanelTest, "Tag", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'elysia-floating-panel-test'
});
Object.defineProperty(ElysiaFloatingPanelTest, "styles", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: css `
		.header {

		}
		.body {
			display: flex;
			flex-direction: column;
			gap: 1em;
		}
	`
});
defineComponent(ElysiaFloatingPanelTest);
