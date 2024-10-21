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
var _DebugActor_debugMesh, _DebugActor_axis;
import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
/** An actor that renders a debug bounding box and axis for its parent actor. */
export class DebugActor extends Actor {
    constructor() {
        super(...arguments);
        _DebugActor_debugMesh.set(this, void 0);
        _DebugActor_axis.set(this, void 0);
    }
    /** Adds a debug helper to an Actor. */
    static Debug(a) {
        const d = new DebugActor;
        a.addComponent(d);
        return d;
    }
    onEnterScene() {
        super.onEnterScene();
        this.object3d.add(__classPrivateFieldSet(this, _DebugActor_debugMesh, new Three.BoxHelper(this.parent.object3d, 0xffff00), "f"));
        this.object3d.add(__classPrivateFieldSet(this, _DebugActor_axis, new Three.AxesHelper(5), "f"));
    }
    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);
        __classPrivateFieldGet(this, _DebugActor_debugMesh, "f")?.update(this.parent.object3d);
    }
    onLeaveScene() {
        super.onLeaveScene();
        __classPrivateFieldGet(this, _DebugActor_debugMesh, "f")?.dispose();
        __classPrivateFieldSet(this, _DebugActor_debugMesh, undefined, "f");
        __classPrivateFieldGet(this, _DebugActor_axis, "f")?.dispose();
        __classPrivateFieldSet(this, _DebugActor_axis, undefined, "f");
    }
}
_DebugActor_debugMesh = new WeakMap(), _DebugActor_axis = new WeakMap();
