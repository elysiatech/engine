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
var _ResizeController_event, _ResizeController_observer, _ResizeController_onResize;
import { isBrowser } from "./Asserts.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ElysiaEvent } from "../Events/Event.js";
export class ResizeEvent extends ElysiaEvent {
}
export class ResizeController {
    constructor(element) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: element
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "addEventListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "removeEventListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _ResizeController_event.set(this, new ElysiaEventDispatcher);
        _ResizeController_observer.set(this, void 0);
        _ResizeController_onResize.set(this, (e) => {
            if (this.element) {
                const bounds = this.element.getBoundingClientRect();
                this.width = bounds.width;
                this.height = bounds.height;
                __classPrivateFieldGet(this, _ResizeController_event, "f").dispatchEvent(new ResizeEvent({ x: this.width, y: this.height }));
            }
            else {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                __classPrivateFieldGet(this, _ResizeController_event, "f").dispatchEvent(new ResizeEvent({ x: this.width, y: this.height }));
            }
        });
        if (!isBrowser())
            return;
        if (element) {
            __classPrivateFieldSet(this, _ResizeController_observer, new ResizeObserver((entries) => {
                const cr = entries[0].contentRect;
                this.width = cr.width;
                this.height = cr.height;
                __classPrivateFieldGet(this, _ResizeController_event, "f").dispatchEvent(new ResizeEvent({ x: this.width, y: this.height }));
            }), "f");
            __classPrivateFieldGet(this, _ResizeController_observer, "f").observe(element);
            const bounds = element.getBoundingClientRect();
            this.width = bounds.width;
            this.height = bounds.height;
            window.addEventListener("resize", __classPrivateFieldGet(this, _ResizeController_onResize, "f"));
        }
        else {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
        window.addEventListener("resize", __classPrivateFieldGet(this, _ResizeController_onResize, "f"));
        this.addEventListener = __classPrivateFieldGet(this, _ResizeController_event, "f").addEventListener.bind(__classPrivateFieldGet(this, _ResizeController_event, "f"));
        this.removeEventListener = __classPrivateFieldGet(this, _ResizeController_event, "f").removeEventListener.bind(__classPrivateFieldGet(this, _ResizeController_event, "f"));
    }
    destructor() {
        window.removeEventListener("resize", __classPrivateFieldGet(this, _ResizeController_onResize, "f"));
        __classPrivateFieldGet(this, _ResizeController_observer, "f")?.disconnect();
        __classPrivateFieldGet(this, _ResizeController_event, "f").clear();
    }
}
_ResizeController_event = new WeakMap(), _ResizeController_observer = new WeakMap(), _ResizeController_onResize = new WeakMap();
