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
var _MouseObserver_x, _MouseObserver_y, _MouseObserver_mouseDown, _MouseObserver_subscribers, _MouseObserver_onMouseMove, _MouseObserver_onMouseDown, _MouseObserver_onMouseUp;
export class MouseObserver {
    get x() { return __classPrivateFieldGet(this, _MouseObserver_x, "f"); }
    get y() { return __classPrivateFieldGet(this, _MouseObserver_y, "f"); }
    get leftDown() { return __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").left; }
    get middleDown() { return __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").middle; }
    get rightDown() { return __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").right; }
    get fourDown() { return __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").four; }
    get fiveDown() { return __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").five; }
    constructor(target) {
        Object.defineProperty(this, "target", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: target
        });
        _MouseObserver_x.set(this, 0);
        _MouseObserver_y.set(this, 0);
        _MouseObserver_mouseDown.set(this, {
            left: false,
            middle: false,
            right: false,
            four: false,
            five: false,
        });
        _MouseObserver_subscribers.set(this, new Map);
        _MouseObserver_onMouseMove.set(this, (event) => {
            __classPrivateFieldSet(this, _MouseObserver_x, event.clientX, "f");
            __classPrivateFieldSet(this, _MouseObserver_y, event.clientY, "f");
            const subs = __classPrivateFieldGet(this, _MouseObserver_subscribers, "f").get("mousemove");
            if (subs) {
                for (const subscriber of subs) {
                    subscriber(event);
                }
            }
        });
        _MouseObserver_onMouseDown.set(this, (event) => {
            const key = event.button;
            switch (key) {
                case 0:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").left = true;
                    break;
                case 1:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").middle = true;
                    break;
                case 2:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").right = true;
                    break;
                case 3:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").four = true;
                    break;
                case 4:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").five = true;
                    break;
            }
            const subs = __classPrivateFieldGet(this, _MouseObserver_subscribers, "f").get("mousedown");
            if (subs) {
                for (const subscriber of subs) {
                    subscriber(event);
                }
            }
        });
        _MouseObserver_onMouseUp.set(this, (event) => {
            const key = event.button;
            switch (key) {
                case 0:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").left = false;
                    break;
                case 1:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").middle = false;
                    break;
                case 2:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").right = false;
                    break;
                case 3:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").four = false;
                    break;
                case 4:
                    __classPrivateFieldGet(this, _MouseObserver_mouseDown, "f").five = false;
                    break;
            }
            const subs = __classPrivateFieldGet(this, _MouseObserver_subscribers, "f").get("mouseup");
            if (subs) {
                for (const subscriber of subs) {
                    subscriber(event);
                }
            }
        });
        target.addEventListener("mousemove", __classPrivateFieldGet(this, _MouseObserver_onMouseMove, "f"));
        target.addEventListener("mousedown", __classPrivateFieldGet(this, _MouseObserver_onMouseDown, "f"));
        target.addEventListener("mouseup", __classPrivateFieldGet(this, _MouseObserver_onMouseUp, "f"));
    }
    addEventListener(type, callback) {
        __classPrivateFieldGet(this, _MouseObserver_subscribers, "f").set(type, __classPrivateFieldGet(this, _MouseObserver_subscribers, "f").get(type) ?? new Set());
        __classPrivateFieldGet(this, _MouseObserver_subscribers, "f").get(type).add(callback);
        return () => this.removeEventListener(type, callback);
    }
    removeEventListener(type, callback) {
        const subs = __classPrivateFieldGet(this, _MouseObserver_subscribers, "f").get(type);
        if (subs) {
            subs.delete(callback);
        }
    }
    destructor() {
        window.removeEventListener("mousemove", __classPrivateFieldGet(this, _MouseObserver_onMouseMove, "f"));
        for (const subs of __classPrivateFieldGet(this, _MouseObserver_subscribers, "f").values()) {
            subs.clear();
        }
    }
}
_MouseObserver_x = new WeakMap(), _MouseObserver_y = new WeakMap(), _MouseObserver_mouseDown = new WeakMap(), _MouseObserver_subscribers = new WeakMap(), _MouseObserver_onMouseMove = new WeakMap(), _MouseObserver_onMouseDown = new WeakMap(), _MouseObserver_onMouseUp = new WeakMap();
