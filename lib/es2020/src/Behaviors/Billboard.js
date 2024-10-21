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
var _BillboardBehavior_lockX, _BillboardBehavior_lockY, _BillboardBehavior_lockZ;
import { Behavior } from "../Scene/Behavior.js";
/**
 * A behavior that makes the s_Parent object always face the camera.
 */
export class BillboardBehavior extends Behavior {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'BillboardBehavior'
        });
        _BillboardBehavior_lockX.set(this, false);
        _BillboardBehavior_lockY.set(this, false);
        _BillboardBehavior_lockZ.set(this, false);
    }
    /**
     * Lock the rotation on the X axis.
     * @default false
     */
    get lockX() { return __classPrivateFieldGet(this, _BillboardBehavior_lockX, "f"); }
    set lockX(value) { __classPrivateFieldSet(this, _BillboardBehavior_lockX, value, "f"); }
    /**
     * Lock the rotation on the Y axis.
     * @default false
     */
    get lockY() { return __classPrivateFieldGet(this, _BillboardBehavior_lockY, "f"); }
    set lockY(value) { __classPrivateFieldSet(this, _BillboardBehavior_lockY, value, "f"); }
    /**
     * Lock the rotation on the Z axis.
     * @default false
     */
    get lockZ() { return __classPrivateFieldGet(this, _BillboardBehavior_lockZ, "f"); }
    set lockZ(value) { __classPrivateFieldSet(this, _BillboardBehavior_lockZ, value, "f"); }
    onUpdate(delta, elapsed) {
        if (!this.parent)
            return;
        // save previous rotation in case we're locking an axis
        const prevRotation = this.parent.object3d.rotation.clone();
        // always face the camera
        this.scene?.getActiveCamera()?.getWorldQuaternion(this.parent.object3d.quaternion);
        // readjust any axis that is locked
        if (__classPrivateFieldGet(this, _BillboardBehavior_lockX, "f"))
            this.parent.object3d.rotation.x = prevRotation.x;
        if (__classPrivateFieldGet(this, _BillboardBehavior_lockY, "f"))
            this.parent.object3d.rotation.y = prevRotation.y;
        if (__classPrivateFieldGet(this, _BillboardBehavior_lockZ, "f"))
            this.parent.object3d.rotation.z = prevRotation.z;
    }
}
_BillboardBehavior_lockX = new WeakMap(), _BillboardBehavior_lockY = new WeakMap(), _BillboardBehavior_lockZ = new WeakMap();
