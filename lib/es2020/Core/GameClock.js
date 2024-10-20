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
var _GameClock_started, _GameClock_now, _GameClock_last, _GameClock_elapsed, _GameClock_delta;
/** @internal */ export class GameClock {
    constructor() {
        _GameClock_started.set(this, false);
        _GameClock_now.set(this, 0);
        _GameClock_last.set(this, 0);
        _GameClock_elapsed.set(this, 0);
        _GameClock_delta.set(this, 0.016);
    }
    get elapsed() { return __classPrivateFieldGet(this, _GameClock_elapsed, "f"); }
    get delta() { return __classPrivateFieldGet(this, _GameClock_delta, "f"); }
    capture() {
        if (!__classPrivateFieldGet(this, _GameClock_started, "f")) {
            __classPrivateFieldSet(this, _GameClock_started, true, "f");
            __classPrivateFieldSet(this, _GameClock_now, performance.now(), "f");
            __classPrivateFieldSet(this, _GameClock_last, __classPrivateFieldGet(this, _GameClock_now, "f"), "f");
            return;
        }
        __classPrivateFieldSet(this, _GameClock_now, performance.now(), "f");
        __classPrivateFieldSet(this, _GameClock_delta, (__classPrivateFieldGet(this, _GameClock_now, "f") - __classPrivateFieldGet(this, _GameClock_last, "f")) / 1000, "f");
        __classPrivateFieldSet(this, _GameClock_elapsed, __classPrivateFieldGet(this, _GameClock_elapsed, "f") + __classPrivateFieldGet(this, _GameClock_delta, "f"), "f");
        __classPrivateFieldSet(this, _GameClock_last, __classPrivateFieldGet(this, _GameClock_now, "f"), "f");
    }
}
_GameClock_started = new WeakMap(), _GameClock_now = new WeakMap(), _GameClock_last = new WeakMap(), _GameClock_elapsed = new WeakMap(), _GameClock_delta = new WeakMap();
