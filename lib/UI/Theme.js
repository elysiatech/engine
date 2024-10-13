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
import { defineComponent, ElysiaElement, html } from "./UI";
import { Colors } from "../Core/Colors";
import { attribute } from "./UI";
let ElysiaTheme = (() => {
    let _classSuper = ElysiaElement;
    let _cullen_decorators;
    let _cullen_initializers = [];
    let _cullen_extraInitializers = [];
    let _nosferatu_decorators;
    let _nosferatu_initializers = [];
    let _nosferatu_extraInitializers = [];
    let _vonCount_decorators;
    let _vonCount_initializers = [];
    let _vonCount_extraInitializers = [];
    let _aro_decorators;
    let _aro_initializers = [];
    let _aro_extraInitializers = [];
    let _red_decorators;
    let _red_initializers = [];
    let _red_extraInitializers = [];
    let _orange_decorators;
    let _orange_initializers = [];
    let _orange_extraInitializers = [];
    let _yellow_decorators;
    let _yellow_initializers = [];
    let _yellow_extraInitializers = [];
    let _green_decorators;
    let _green_initializers = [];
    let _green_extraInitializers = [];
    let _purple_decorators;
    let _purple_initializers = [];
    let _purple_extraInitializers = [];
    let _cyan_decorators;
    let _cyan_initializers = [];
    let _cyan_extraInitializers = [];
    let _pink_decorators;
    let _pink_initializers = [];
    let _pink_extraInitializers = [];
    let _font_decorators;
    let _font_initializers = [];
    let _font_extraInitializers = [];
    return class ElysiaTheme extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _cullen_decorators = [attribute()];
            _nosferatu_decorators = [attribute()];
            _vonCount_decorators = [attribute()];
            _aro_decorators = [attribute()];
            _red_decorators = [attribute()];
            _orange_decorators = [attribute()];
            _yellow_decorators = [attribute()];
            _green_decorators = [attribute()];
            _purple_decorators = [attribute()];
            _cyan_decorators = [attribute()];
            _pink_decorators = [attribute()];
            _font_decorators = [attribute()];
            __esDecorate(this, null, _cullen_decorators, { kind: "accessor", name: "cullen", static: false, private: false, access: { has: obj => "cullen" in obj, get: obj => obj.cullen, set: (obj, value) => { obj.cullen = value; } }, metadata: _metadata }, _cullen_initializers, _cullen_extraInitializers);
            __esDecorate(this, null, _nosferatu_decorators, { kind: "accessor", name: "nosferatu", static: false, private: false, access: { has: obj => "nosferatu" in obj, get: obj => obj.nosferatu, set: (obj, value) => { obj.nosferatu = value; } }, metadata: _metadata }, _nosferatu_initializers, _nosferatu_extraInitializers);
            __esDecorate(this, null, _vonCount_decorators, { kind: "accessor", name: "vonCount", static: false, private: false, access: { has: obj => "vonCount" in obj, get: obj => obj.vonCount, set: (obj, value) => { obj.vonCount = value; } }, metadata: _metadata }, _vonCount_initializers, _vonCount_extraInitializers);
            __esDecorate(this, null, _aro_decorators, { kind: "accessor", name: "aro", static: false, private: false, access: { has: obj => "aro" in obj, get: obj => obj.aro, set: (obj, value) => { obj.aro = value; } }, metadata: _metadata }, _aro_initializers, _aro_extraInitializers);
            __esDecorate(this, null, _red_decorators, { kind: "accessor", name: "red", static: false, private: false, access: { has: obj => "red" in obj, get: obj => obj.red, set: (obj, value) => { obj.red = value; } }, metadata: _metadata }, _red_initializers, _red_extraInitializers);
            __esDecorate(this, null, _orange_decorators, { kind: "accessor", name: "orange", static: false, private: false, access: { has: obj => "orange" in obj, get: obj => obj.orange, set: (obj, value) => { obj.orange = value; } }, metadata: _metadata }, _orange_initializers, _orange_extraInitializers);
            __esDecorate(this, null, _yellow_decorators, { kind: "accessor", name: "yellow", static: false, private: false, access: { has: obj => "yellow" in obj, get: obj => obj.yellow, set: (obj, value) => { obj.yellow = value; } }, metadata: _metadata }, _yellow_initializers, _yellow_extraInitializers);
            __esDecorate(this, null, _green_decorators, { kind: "accessor", name: "green", static: false, private: false, access: { has: obj => "green" in obj, get: obj => obj.green, set: (obj, value) => { obj.green = value; } }, metadata: _metadata }, _green_initializers, _green_extraInitializers);
            __esDecorate(this, null, _purple_decorators, { kind: "accessor", name: "purple", static: false, private: false, access: { has: obj => "purple" in obj, get: obj => obj.purple, set: (obj, value) => { obj.purple = value; } }, metadata: _metadata }, _purple_initializers, _purple_extraInitializers);
            __esDecorate(this, null, _cyan_decorators, { kind: "accessor", name: "cyan", static: false, private: false, access: { has: obj => "cyan" in obj, get: obj => obj.cyan, set: (obj, value) => { obj.cyan = value; } }, metadata: _metadata }, _cyan_initializers, _cyan_extraInitializers);
            __esDecorate(this, null, _pink_decorators, { kind: "accessor", name: "pink", static: false, private: false, access: { has: obj => "pink" in obj, get: obj => obj.pink, set: (obj, value) => { obj.pink = value; } }, metadata: _metadata }, _pink_initializers, _pink_extraInitializers);
            __esDecorate(this, null, _font_decorators, { kind: "accessor", name: "font", static: false, private: false, access: { has: obj => "font" in obj, get: obj => obj.font, set: (obj, value) => { obj.font = value; } }, metadata: _metadata }, _font_initializers, _font_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static Tag = 'elysia-theme';
        #cullen_accessor_storage = __runInitializers(this, _cullen_initializers, Colors.Cullen);
        get cullen() { return this.#cullen_accessor_storage; }
        set cullen(value) { this.#cullen_accessor_storage = value; }
        #nosferatu_accessor_storage = (__runInitializers(this, _cullen_extraInitializers), __runInitializers(this, _nosferatu_initializers, Colors.Nosferatu));
        get nosferatu() { return this.#nosferatu_accessor_storage; }
        set nosferatu(value) { this.#nosferatu_accessor_storage = value; }
        #vonCount_accessor_storage = (__runInitializers(this, _nosferatu_extraInitializers), __runInitializers(this, _vonCount_initializers, Colors.VonCount));
        get vonCount() { return this.#vonCount_accessor_storage; }
        set vonCount(value) { this.#vonCount_accessor_storage = value; }
        #aro_accessor_storage = (__runInitializers(this, _vonCount_extraInitializers), __runInitializers(this, _aro_initializers, Colors.Aro));
        get aro() { return this.#aro_accessor_storage; }
        set aro(value) { this.#aro_accessor_storage = value; }
        #red_accessor_storage = (__runInitializers(this, _aro_extraInitializers), __runInitializers(this, _red_initializers, Colors.Red));
        get red() { return this.#red_accessor_storage; }
        set red(value) { this.#red_accessor_storage = value; }
        #orange_accessor_storage = (__runInitializers(this, _red_extraInitializers), __runInitializers(this, _orange_initializers, Colors.Orange));
        get orange() { return this.#orange_accessor_storage; }
        set orange(value) { this.#orange_accessor_storage = value; }
        #yellow_accessor_storage = (__runInitializers(this, _orange_extraInitializers), __runInitializers(this, _yellow_initializers, Colors.Yellow));
        get yellow() { return this.#yellow_accessor_storage; }
        set yellow(value) { this.#yellow_accessor_storage = value; }
        #green_accessor_storage = (__runInitializers(this, _yellow_extraInitializers), __runInitializers(this, _green_initializers, Colors.Green));
        get green() { return this.#green_accessor_storage; }
        set green(value) { this.#green_accessor_storage = value; }
        #purple_accessor_storage = (__runInitializers(this, _green_extraInitializers), __runInitializers(this, _purple_initializers, Colors.Purple));
        get purple() { return this.#purple_accessor_storage; }
        set purple(value) { this.#purple_accessor_storage = value; }
        #cyan_accessor_storage = (__runInitializers(this, _purple_extraInitializers), __runInitializers(this, _cyan_initializers, Colors.Cyan));
        get cyan() { return this.#cyan_accessor_storage; }
        set cyan(value) { this.#cyan_accessor_storage = value; }
        #pink_accessor_storage = (__runInitializers(this, _cyan_extraInitializers), __runInitializers(this, _pink_initializers, Colors.Pink));
        get pink() { return this.#pink_accessor_storage; }
        set pink(value) { this.#pink_accessor_storage = value; }
        #font_accessor_storage = (__runInitializers(this, _pink_extraInitializers), __runInitializers(this, _font_initializers, 'Kode Mono, sans'));
        get font() { return this.#font_accessor_storage; }
        set font(value) { this.#font_accessor_storage = value; }
        connectedCallback() {
            super.connectedCallback();
            this.#updateStyles();
        }
        onRender() { return html `<slot></slot>`; }
        attributeChangedCallback(name, _old, value) {
            super.attributeChangedCallback(name, _old, value);
            this.#updateStyles();
        }
        onMount() {
            document.head.insertAdjacentHTML('beforeend', `<link href="https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400..700&display=swap" rel="stylesheet">`);
        }
        #updateStyles() {
            this.style.setProperty('--elysia-color-cullen', this.cullen);
            this.style.setProperty('--elysia-color-nosferatu', this.nosferatu);
            this.style.setProperty('--elysia-color-voncount', this.vonCount);
            this.style.setProperty('--elysia-color-aro', this.aro);
            this.style.setProperty('--elysia-color-red', this.red);
            this.style.setProperty('--elysia-color-orange', this.orange);
            this.style.setProperty('--elysia-color-yellow', this.yellow);
            this.style.setProperty('--elysia-color-green', this.green);
            this.style.setProperty('--elysia-color-purple', this.purple);
            this.style.setProperty('--elysia-color-cyan', this.cyan);
            this.style.setProperty('--elysia-color-pink', this.pink);
            this.style.setProperty('--elysia-font-family', 'Kode Mono, sans');
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _font_extraInitializers);
        }
    };
})();
export { ElysiaTheme };
defineComponent(ElysiaTheme);
