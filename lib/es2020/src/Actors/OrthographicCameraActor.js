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
var _OrthographicCameraActor_debug, _OrthographicCameraActor_debugHelper;
import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class OrthographicCameraActor extends Actor {
    set left(value) { this.object3d.left = value; }
    get left() { return this.object3d.left; }
    set right(value) { this.object3d.right = value; }
    get right() { return this.object3d.right; }
    set top(value) { this.object3d.top = value; }
    get top() { return this.object3d.top; }
    set bottom(value) { this.object3d.bottom = value; }
    get bottom() { return this.object3d.bottom; }
    set near(value) { this.object3d.near = value; }
    get near() { return this.object3d.near; }
    set far(value) { this.object3d.far = value; }
    get far() { return this.object3d.far; }
    get zoom() { return this.object3d.zoom; }
    set zoom(value) { this.object3d.zoom = value; }
    get debug() { return __classPrivateFieldGet(this, _OrthographicCameraActor_debug, "f"); }
    set debug(value) {
        __classPrivateFieldSet(this, _OrthographicCameraActor_debug, value, "f");
        if (value) {
            __classPrivateFieldSet(this, _OrthographicCameraActor_debugHelper, __classPrivateFieldGet(this, _OrthographicCameraActor_debugHelper, "f") ?? new Three.CameraHelper(this.object3d), "f");
            this.object3d.add(__classPrivateFieldGet(this, _OrthographicCameraActor_debugHelper, "f"));
        }
        else {
            __classPrivateFieldGet(this, _OrthographicCameraActor_debugHelper, "f")?.parent?.remove(__classPrivateFieldGet(this, _OrthographicCameraActor_debugHelper, "f"));
            __classPrivateFieldGet(this, _OrthographicCameraActor_debugHelper, "f")?.dispose();
            __classPrivateFieldSet(this, _OrthographicCameraActor_debugHelper, undefined, "f");
        }
    }
    constructor() {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "OrthographicCameraActor"
        });
        _OrthographicCameraActor_debug.set(this, false);
        _OrthographicCameraActor_debugHelper.set(this, void 0);
        this.object3d = new Three.OrthographicCamera();
    }
    onResize(x, y) {
        const aspect = x / y;
        this.object3d.left = -1 * aspect;
        this.object3d.right = aspect;
        this.object3d.top = 1;
        this.object3d.bottom = -1;
        this.object3d.updateProjectionMatrix();
    }
}
_OrthographicCameraActor_debug = new WeakMap(), _OrthographicCameraActor_debugHelper = new WeakMap();
