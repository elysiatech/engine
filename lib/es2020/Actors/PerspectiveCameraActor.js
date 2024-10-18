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
var _PerspectiveCameraActor_debug, _PerspectiveCameraActor_debugHelper;
import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class PerspectiveCameraActor extends Actor {
    get fov() { return this.object3d.fov; }
    set fov(fov) {
        this.object3d.fov = fov;
        this.object3d.updateProjectionMatrix();
    }
    get aspect() { return this.object3d.aspect; }
    set aspect(aspect) {
        this.object3d.aspect = aspect;
        this.object3d.updateProjectionMatrix();
    }
    get near() { return this.object3d.near; }
    set near(near) { this.object3d.near = near; }
    get far() { return this.object3d.far; }
    set far(far) { this.object3d.far = far; }
    get zoom() { return this.object3d.zoom; }
    set zoom(zoom) { this.object3d.zoom = zoom; }
    get focus() { return this.object3d.focus; }
    set focus(focus) { this.object3d.focus = focus; }
    get filmGauge() { return this.object3d.filmGauge; }
    set filmGauge(filmGauge) { this.object3d.filmGauge = filmGauge; }
    get filmOffset() { return this.object3d.filmOffset; }
    set filmOffset(filmOffset) { this.object3d.filmOffset = filmOffset; }
    get view() { return this.object3d.view; }
    set view(view) { this.object3d.view = view; }
    get debug() { return __classPrivateFieldGet(this, _PerspectiveCameraActor_debug, "f"); }
    set debug(value) {
        __classPrivateFieldSet(this, _PerspectiveCameraActor_debug, value, "f");
        if (value) {
            __classPrivateFieldSet(this, _PerspectiveCameraActor_debugHelper, __classPrivateFieldGet(this, _PerspectiveCameraActor_debugHelper, "f") ?? new Three.CameraHelper(this.object3d), "f");
            this.scene?.object3d.add(__classPrivateFieldGet(this, _PerspectiveCameraActor_debugHelper, "f"));
        }
        else {
            __classPrivateFieldGet(this, _PerspectiveCameraActor_debugHelper, "f")?.removeFromParent();
            __classPrivateFieldGet(this, _PerspectiveCameraActor_debugHelper, "f")?.dispose();
            __classPrivateFieldSet(this, _PerspectiveCameraActor_debugHelper, undefined, "f");
        }
    }
    constructor() {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "PerspectiveCameraActor"
        });
        _PerspectiveCameraActor_debug.set(this, false);
        _PerspectiveCameraActor_debugHelper.set(this, void 0);
        this.onResize = this.onResize.bind(this);
        this.object3d = new Three.PerspectiveCamera();
    }
    onCreate() {
        this.object3d.userData.LOL = true;
        if (this.debug)
            this.scene.object3d.add(__classPrivateFieldGet(this, _PerspectiveCameraActor_debugHelper, "f"));
    }
    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);
        if (this.debug)
            __classPrivateFieldGet(this, _PerspectiveCameraActor_debugHelper, "f")?.update();
    }
    onDestroy() {
        __classPrivateFieldGet(this, _PerspectiveCameraActor_debugHelper, "f")?.dispose();
    }
    onResize(x, y) {
        this.object3d.aspect = x / y;
        this.object3d.updateProjectionMatrix();
    }
}
_PerspectiveCameraActor_debug = new WeakMap(), _PerspectiveCameraActor_debugHelper = new WeakMap();
