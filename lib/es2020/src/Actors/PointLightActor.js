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
var _PointLightActor_debug;
import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class PointLightActor extends Actor {
    get intensity() { return this.object3d.intensity; }
    set intensity(value) { this.object3d.intensity = value; }
    get color() { return this.object3d.color; }
    set color(value) { this.object3d.color = value; }
    get distance() { return this.object3d.distance; }
    set distance(value) { this.object3d.distance = value; }
    get decay() { return this.object3d.decay; }
    set decay(value) { this.object3d.decay = value; }
    get shadow() { return this.object3d.shadow; }
    get power() { return this.object3d.power; }
    set power(value) { this.object3d.power = value; }
    get castShadow() { return this.object3d.castShadow; }
    set castShadow(value) { this.object3d.castShadow = value; }
    get debug() { return __classPrivateFieldGet(this, _PointLightActor_debug, "f"); }
    set debug(value) {
        __classPrivateFieldSet(this, _PointLightActor_debug, value, "f");
        if (value) {
            const helper = new Three.PointLightHelper(this.object3d);
            this.object3d.add(helper);
        }
        else {
            const helper = this.object3d.children.find((child) => child instanceof Three.PointLightHelper);
            if (helper)
                this.object3d.remove(helper);
        }
    }
    constructor(color, intensity, distance, decay) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "PointLightActor"
        });
        _PointLightActor_debug.set(this, false);
        this.object3d = new Three.PointLight(color, intensity, distance, decay);
        this.object3d.actor = this;
        this.castShadow = true;
    }
}
_PointLightActor_debug = new WeakMap();
