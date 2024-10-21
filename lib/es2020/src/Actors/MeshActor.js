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
var _MeshActor_debug, _MeshActor_debugHelper;
import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class MeshActor extends Actor {
    get geometry() { return this.object3d.geometry; }
    set geometry(value) { this.object3d.geometry = value; }
    get material() { return this.object3d.material; }
    set material(value) { this.object3d.material = value; }
    get castShadow() { return this.object3d.castShadow; }
    set castShadow(value) { this.object3d.castShadow = value; }
    get receiveShadow() { return this.object3d.receiveShadow; }
    set receiveShadow(value) { this.object3d.receiveShadow = value; }
    get debug() { return __classPrivateFieldGet(this, _MeshActor_debug, "f"); }
    set debug(value) {
        if (value) {
            __classPrivateFieldSet(this, _MeshActor_debugHelper, __classPrivateFieldGet(this, _MeshActor_debugHelper, "f") ?? new Three.BoxHelper(this.object3d, "red"), "f");
            this.object3d.add(__classPrivateFieldGet(this, _MeshActor_debugHelper, "f"));
        }
        else {
            __classPrivateFieldGet(this, _MeshActor_debugHelper, "f")?.parent?.remove(__classPrivateFieldGet(this, _MeshActor_debugHelper, "f"));
            __classPrivateFieldGet(this, _MeshActor_debugHelper, "f")?.dispose();
            __classPrivateFieldSet(this, _MeshActor_debugHelper, undefined, "f");
        }
        __classPrivateFieldSet(this, _MeshActor_debug, value, "f");
    }
    constructor(geometry, material, castShadow = true, receiveShadow = true) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "MeshActor"
        });
        _MeshActor_debug.set(this, false);
        _MeshActor_debugHelper.set(this, void 0);
        this.object3d = new Three.Mesh(geometry, material);
        this.castShadow = castShadow;
        this.receiveShadow = receiveShadow;
    }
}
_MeshActor_debug = new WeakMap(), _MeshActor_debugHelper = new WeakMap();
