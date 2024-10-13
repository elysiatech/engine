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
import { LitElement, nothing, html, css } from "lit";
import { property } from "lit/decorators/property.js";
const c = (...args) => args.filter(Boolean).join(" ");
let ElysiaCrossHair = (() => {
    let _classSuper = LitElement;
    let _gap_decorators;
    let _gap_initializers = [];
    let _gap_extraInitializers = [];
    let _thickness_decorators;
    let _thickness_initializers = [];
    let _thickness_extraInitializers = [];
    let _length_decorators;
    let _length_initializers = [];
    let _length_extraInitializers = [];
    let _color_decorators;
    let _color_initializers = [];
    let _color_extraInitializers = [];
    let _dot_decorators;
    let _dot_initializers = [];
    let _dot_extraInitializers = [];
    let _outline_decorators;
    let _outline_initializers = [];
    let _outline_extraInitializers = [];
    let _t_decorators;
    let _t_initializers = [];
    let _t_extraInitializers = [];
    let _visible_decorators;
    let _visible_initializers = [];
    let _visible_extraInitializers = [];
    return class ElysiaCrossHair extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _gap_decorators = [property({ type: Number, reflect: true })];
            _thickness_decorators = [property({ type: Number, reflect: true })];
            _length_decorators = [property({ type: Number, reflect: true })];
            _color_decorators = [property({ type: String, reflect: true })];
            _dot_decorators = [property({ type: Boolean, reflect: true })];
            _outline_decorators = [property({ type: Boolean, reflect: true })];
            _t_decorators = [property({ type: Boolean, reflect: true })];
            _visible_decorators = [property({ type: Boolean, reflect: true })];
            __esDecorate(this, null, _gap_decorators, { kind: "accessor", name: "gap", static: false, private: false, access: { has: obj => "gap" in obj, get: obj => obj.gap, set: (obj, value) => { obj.gap = value; } }, metadata: _metadata }, _gap_initializers, _gap_extraInitializers);
            __esDecorate(this, null, _thickness_decorators, { kind: "accessor", name: "thickness", static: false, private: false, access: { has: obj => "thickness" in obj, get: obj => obj.thickness, set: (obj, value) => { obj.thickness = value; } }, metadata: _metadata }, _thickness_initializers, _thickness_extraInitializers);
            __esDecorate(this, null, _length_decorators, { kind: "accessor", name: "length", static: false, private: false, access: { has: obj => "length" in obj, get: obj => obj.length, set: (obj, value) => { obj.length = value; } }, metadata: _metadata }, _length_initializers, _length_extraInitializers);
            __esDecorate(this, null, _color_decorators, { kind: "accessor", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color, set: (obj, value) => { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(this, null, _dot_decorators, { kind: "accessor", name: "dot", static: false, private: false, access: { has: obj => "dot" in obj, get: obj => obj.dot, set: (obj, value) => { obj.dot = value; } }, metadata: _metadata }, _dot_initializers, _dot_extraInitializers);
            __esDecorate(this, null, _outline_decorators, { kind: "accessor", name: "outline", static: false, private: false, access: { has: obj => "outline" in obj, get: obj => obj.outline, set: (obj, value) => { obj.outline = value; } }, metadata: _metadata }, _outline_initializers, _outline_extraInitializers);
            __esDecorate(this, null, _t_decorators, { kind: "accessor", name: "t", static: false, private: false, access: { has: obj => "t" in obj, get: obj => obj.t, set: (obj, value) => { obj.t = value; } }, metadata: _metadata }, _t_initializers, _t_extraInitializers);
            __esDecorate(this, null, _visible_decorators, { kind: "accessor", name: "visible", static: false, private: false, access: { has: obj => "visible" in obj, get: obj => obj.visible, set: (obj, value) => { obj.visible = value; } }, metadata: _metadata }, _visible_initializers, _visible_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static styles = css `
        :host {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: none;
        }

        .left {
            position: absolute;
            top: 50%;
            left: calc(50% - calc(var(--length) + var(--gap)));
			transform: translate(0, -50%);
            width: var(--length);
            height: var(--thickness);
            background: var(--color);
            outline: black solid var(--outline);
        }

        .right {
            position: absolute;
            top: 50%;
            left: calc(50% + var(--gap));
			transform: translate(0, -50%);
            width: var(--length);
            height: var(--thickness);
            background: var(--color);
			outline: black solid var(--outline);
        }

        .top {
            position: absolute;
            top: calc(50% - calc(var(--length) + var(--gap)));
            left: 50%;
            transform: translate(-50%, 0);
            width: var(--thickness);
            height: var(--length);
            background: var(--color);
            outline: black solid var(--outline);
        }

        .bottom {
            position: absolute;
            top: calc(50% + var(--gap));
            left: 50%;
            transform: translate(-50%, 0);
            width: var(--thickness);
            height: var(--length);
            background: var(--color);
            outline: black solid var(--outline);
        }
		
		.dot {
			position: absolute;
			top: 50%;
			left: 50%;
			width: var(--thickness);
			height: var(--thickness);
			background: var(--color);
			outline: black solid var(--outline);
			transform: translate(-50%, -50%);
		}
	`;
        #gap_accessor_storage = __runInitializers(this, _gap_initializers, 4);
        get gap() { return this.#gap_accessor_storage; }
        set gap(value) { this.#gap_accessor_storage = value; }
        #thickness_accessor_storage = (__runInitializers(this, _gap_extraInitializers), __runInitializers(this, _thickness_initializers, 2));
        get thickness() { return this.#thickness_accessor_storage; }
        set thickness(value) { this.#thickness_accessor_storage = value; }
        #length_accessor_storage = (__runInitializers(this, _thickness_extraInitializers), __runInitializers(this, _length_initializers, 8));
        get length() { return this.#length_accessor_storage; }
        set length(value) { this.#length_accessor_storage = value; }
        #color_accessor_storage = (__runInitializers(this, _length_extraInitializers), __runInitializers(this, _color_initializers, "white"));
        get color() { return this.#color_accessor_storage; }
        set color(value) { this.#color_accessor_storage = value; }
        #dot_accessor_storage = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _dot_initializers, false));
        get dot() { return this.#dot_accessor_storage; }
        set dot(value) { this.#dot_accessor_storage = value; }
        #outline_accessor_storage = (__runInitializers(this, _dot_extraInitializers), __runInitializers(this, _outline_initializers, false));
        get outline() { return this.#outline_accessor_storage; }
        set outline(value) { this.#outline_accessor_storage = value; }
        #t_accessor_storage = (__runInitializers(this, _outline_extraInitializers), __runInitializers(this, _t_initializers, false));
        get t() { return this.#t_accessor_storage; }
        set t(value) { this.#t_accessor_storage = value; }
        #visible_accessor_storage = (__runInitializers(this, _t_extraInitializers), __runInitializers(this, _visible_initializers, true));
        get visible() { return this.#visible_accessor_storage; }
        set visible(value) { this.#visible_accessor_storage = value; }
        connectedCallback() {
            super.connectedCallback();
            this.updateStyles();
        }
        render() {
            if (!this.visible)
                return nothing;
            return html `
			<div class=${c('left')}></div>
			<div class=${c('right')}></div>
			${this.t ? nothing : html `<div class=${c('top')}></div>`}
			<div class=${c('bottom')}></div>
			${this.dot ? html `<div class="dot"></div>` : nothing}
		`;
        }
        updateStyles() {
            this.style.setProperty("--gap", `${this.gap}px`);
            this.style.setProperty("--thickness", `${this.thickness}px`);
            this.style.setProperty("--length", `${this.length}px`);
            this.style.setProperty("--color", this.color);
            this.style.setProperty("--outline", this.outline ? "1px" : "0");
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _visible_extraInitializers);
        }
    };
})();
export { ElysiaCrossHair };
customElements.define("elysia-crosshair", ElysiaCrossHair);
