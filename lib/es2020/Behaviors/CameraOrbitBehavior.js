var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CameraOrbitBehavior_smooth;
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Behavior } from "../Scene/Behavior.js";
import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { isOrthographicCamera, isPerspectiveCamera } from "../Core/Asserts.js";
/**
 * Implements the standard orbit controls for a camera.
 */
export class CameraOrbitBehavior extends Behavior {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CameraOrbitBehavior'
        });
        Object.defineProperty(this, "controls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _CameraOrbitBehavior_smooth.set(this, false);
    }
    /**
     * Whether the camera should be damped smooth or not.
     * @default false
     */
    get smooth() { return this.controls?.enableDamping ?? false; }
    set smooth(value) {
        if (this.controls)
            this.controls.enableDamping = value;
        __classPrivateFieldSet(this, _CameraOrbitBehavior_smooth, value, "f");
    }
    onCreate() {
        super.onCreate();
        const camera = this.parent?.object3d;
        if (!camera) {
            ELYSIA_LOGGER.error("No camera found to attach orbit controls to", this.parent);
            return;
        }
        if (!isPerspectiveCamera(camera) && !isOrthographicCamera(camera)) {
            ELYSIA_LOGGER.error("Camera is not a Perspective or Orthographic camera", camera);
            return;
        }
        this.controls = new OrbitControls(camera, this.app.renderPipeline.getRenderer().domElement);
        this.controls.enableDamping = __classPrivateFieldGet(this, _CameraOrbitBehavior_smooth, "f");
    }
    onUpdate() {
        if (this.controls) {
            this.controls.update();
        }
    }
}
_CameraOrbitBehavior_smooth = new WeakMap();
