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
var _FloatBehavior_offset, _FloatBehavior_speed, _FloatBehavior_rotationIntensity, _FloatBehavior_floatIntensity, _FloatBehavior_floatingRange;
import * as Three from "three";
import { Behavior } from "../Scene/Behavior.js";
/** A behavior that makes an object smoothly float and rotate. */
export class FloatBehavior extends Behavior {
    get offset() { return __classPrivateFieldGet(this, _FloatBehavior_offset, "f"); }
    set offset(value) { __classPrivateFieldSet(this, _FloatBehavior_offset, value, "f"); }
    get speed() { return __classPrivateFieldGet(this, _FloatBehavior_speed, "f"); }
    set speed(value) { __classPrivateFieldSet(this, _FloatBehavior_speed, value, "f"); }
    get rotationIntensity() { return __classPrivateFieldGet(this, _FloatBehavior_rotationIntensity, "f"); }
    set rotationIntensity(value) { __classPrivateFieldSet(this, _FloatBehavior_rotationIntensity, value, "f"); }
    get floatIntensity() { return __classPrivateFieldGet(this, _FloatBehavior_floatIntensity, "f"); }
    set floatIntensity(value) { __classPrivateFieldSet(this, _FloatBehavior_floatIntensity, value, "f"); }
    get floatingRange() { return __classPrivateFieldGet(this, _FloatBehavior_floatingRange, "f"); }
    set floatingRange(value) { __classPrivateFieldSet(this, _FloatBehavior_floatingRange, value, "f"); }
    constructor(args = {}) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'FloatBehavior'
        });
        _FloatBehavior_offset.set(this, void 0);
        _FloatBehavior_speed.set(this, void 0);
        _FloatBehavior_rotationIntensity.set(this, void 0);
        _FloatBehavior_floatIntensity.set(this, void 0);
        _FloatBehavior_floatingRange.set(this, void 0);
        __classPrivateFieldSet(this, _FloatBehavior_offset, args.offset ?? Math.random() * 10000, "f");
        __classPrivateFieldSet(this, _FloatBehavior_speed, args.speed ?? 1, "f");
        __classPrivateFieldSet(this, _FloatBehavior_rotationIntensity, args.rotationIntensity ?? 1, "f");
        __classPrivateFieldSet(this, _FloatBehavior_floatIntensity, args.floatIntensity ?? 1, "f");
        __classPrivateFieldSet(this, _FloatBehavior_floatingRange, args.floatingRange ?? [-0.1, 0.1], "f");
    }
    onUpdate(frametime, elapsedtime) {
        if (__classPrivateFieldGet(this, _FloatBehavior_speed, "f") === 0 || !this.parent)
            return;
        const t = __classPrivateFieldGet(this, _FloatBehavior_offset, "f") + elapsedtime;
        this.parent.rotation.x =
            (Math.cos((t / 4) * __classPrivateFieldGet(this, _FloatBehavior_speed, "f") * 2) / 8) * __classPrivateFieldGet(this, _FloatBehavior_rotationIntensity, "f");
        this.parent.rotation.y =
            (Math.sin((t / 4) * __classPrivateFieldGet(this, _FloatBehavior_speed, "f") * 2) / 8) * __classPrivateFieldGet(this, _FloatBehavior_rotationIntensity, "f");
        this.parent.rotation.z =
            (Math.sin((t / 4) * __classPrivateFieldGet(this, _FloatBehavior_speed, "f") * 2) / 20) * __classPrivateFieldGet(this, _FloatBehavior_rotationIntensity, "f");
        let yPosition = Math.sin((t / 4) * __classPrivateFieldGet(this, _FloatBehavior_speed, "f") * 2) / 10;
        yPosition = Three.MathUtils.mapLinear(yPosition, -0.1, 0.1, __classPrivateFieldGet(this, _FloatBehavior_floatingRange, "f")?.[0] ?? -0.1, __classPrivateFieldGet(this, _FloatBehavior_floatingRange, "f")?.[1] ?? 0.1);
        this.parent.position.y = yPosition * __classPrivateFieldGet(this, _FloatBehavior_floatIntensity, "f");
        this.parent.object3d.updateMatrix();
    }
}
_FloatBehavior_offset = new WeakMap(), _FloatBehavior_speed = new WeakMap(), _FloatBehavior_rotationIntensity = new WeakMap(), _FloatBehavior_floatIntensity = new WeakMap(), _FloatBehavior_floatingRange = new WeakMap();
