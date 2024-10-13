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
import { query } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";
import "./Widgets";
export class DraggableController {
    host;
    mouseDown = false;
    dragging = false;
    start = { x: 0, y: 0 };
    offset = { x: 0, y: 0 };
    last = { x: 0, y: 0 };
    x = 0;
    y = 0;
    constructor(host) {
        this.host = host;
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
            this.#handle = childContainer;
        });
    }
    hostConnected() { window.addEventListener("resize", this.#onWindowResize); }
    hostDisconnected() { window.removeEventListener("resize", this.#onWindowResize); }
    hostUpdated() { this.#handle?.addEventListener("mousedown", this.#onDragStart); }
    #handle_accessor_storage;
    get #handle() { return this.#handle_accessor_storage; }
    set #handle(value) { this.#handle_accessor_storage = value; }
    #onDragStart = (e) => {
        this.mouseDown = true;
        this.offset = {
            x: e.clientX - this.x,
            y: e.clientY - this.y,
        };
        this.start = {
            x: e.clientX - this.offset.x,
            y: e.clientY - this.offset.y,
        };
        window.addEventListener("mousemove", this.#onDragMove);
        window.addEventListener("mouseup", this.#onDragEnd);
    };
    #onDragMove = (e) => {
        if (!this.mouseDown)
            return;
        if (!this.dragging)
            this.dragging = true;
        // want to constrain the parent bounds to the window
        const bounds = this.host.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - this.offset.x, window.innerWidth - bounds.width));
        const y = Math.max(0, Math.min(e.clientY - this.offset.y, window.innerHeight - bounds.height));
        this.x = x;
        this.y = y;
        this.last = { x, y };
        this.host.style.transform = `translate(${this.x}px, ${this.y}px)`;
    };
    #onDragEnd = () => {
        this.dragging = false;
        this.mouseDown = false;
        window.removeEventListener("mousemove", this.#onDragMove);
        window.removeEventListener("mouseup", this.#onDragEnd);
    };
    #onWindowResize = () => {
        const bounds = this.host.getBoundingClientRect();
        const x = Math.max(0, Math.min(this.last.x, window.innerWidth - bounds.width));
        const y = Math.max(0, Math.min(this.last.y, window.innerHeight - bounds.height));
        this.x = x;
        this.y = y;
        this.host.style.transform = `translate(${this.x}px, ${this.y}px)`;
    };
}
export class CollapsableController {
    host;
    isOpen = true;
    constructor(host) {
        this.host = host;
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
            this.#trigger = trigger;
            this.#trigger.addEventListener("mousedown", this.#onMouseDown);
            this.#trigger.addEventListener("mouseup", this.#onMouseUp);
        });
    }
    bindContainer() {
        return ref((container) => {
            if (!container)
                return;
            this.#container = container;
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
        const containerDisplay = this.#container.style.display;
        this.#container.style.display = "none";
        this.host.style.height = 'auto';
        const newRootHeight = this.host.getBoundingClientRect().height;
        this.#container.style.display = containerDisplay;
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
    #container;
    #trigger;
    #startPosition = { x: 0, y: 0 };
    #onMouseDown = (e) => { this.#startPosition = { x: e.clientX, y: e.clientY }; };
    #onMouseUp = (e) => {
        if (this.#startPosition.x !== e.clientX || this.#startPosition.y !== e.clientY)
            return;
        this.toggle();
    };
}
let ElysiaFloatingPanel = (() => {
    let _classSuper = ElysiaElement;
    let _header_decorators;
    let _header_initializers = [];
    let _header_extraInitializers = [];
    return class ElysiaFloatingPanel extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _header_decorators = [query('.header')];
            __esDecorate(this, null, _header_decorators, { kind: "accessor", name: "header", static: false, private: false, access: { has: obj => "header" in obj, get: obj => obj.header, set: (obj, value) => { obj.header = value; } }, metadata: _metadata }, _header_initializers, _header_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static Tag = 'elysia-floating-panel';
        static styles = css `
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
	`;
        #header_accessor_storage = __runInitializers(this, _header_initializers, null);
        get header() { return this.#header_accessor_storage; }
        set header(value) { this.#header_accessor_storage = value; }
        dragger = __runInitializers(this, _header_extraInitializers);
        dropper;
        constructor() {
            super();
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
    };
})();
export { ElysiaFloatingPanel };
defineComponent(ElysiaFloatingPanel);
export class ElysiaFloatingPanelTest extends ElysiaElement {
    static Tag = 'elysia-floating-panel-test';
    static styles = css `
		.header {

		}
		.body {
			display: flex;
			flex-direction: column;
			gap: 1em;
		}
	`;
    vec = { x: 4, y: 2 };
    number = 5;
    bool = true;
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
defineComponent(ElysiaFloatingPanelTest);
