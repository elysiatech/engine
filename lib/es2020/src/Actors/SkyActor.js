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
var _SkyActor_sunPosition, _SkyActor_elevation, _SkyActor_azimuth;
import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { isActor } from "../Scene/Component.js";
export const SkyDirectionalLightTag = Symbol.for("Elysia::SkyDirectionalLight");
export class SkyActor extends Actor {
    get turbidity() { return this.material.uniforms.turbidity.value; }
    set turbidity(v) { this.material.uniforms.turbidity.value = v; }
    get rayleigh() { return this.material.uniforms.rayleigh.value; }
    set rayleigh(v) { this.material.uniforms.rayleigh.value = v; }
    get mieCoefficient() { return this.material.uniforms.mieCoefficient.value; }
    set mieCoefficient(v) { this.material.uniforms.mieCoefficient.value = v; }
    get mieDirectionalG() { return this.material.uniforms.mieDirectionalG.value; }
    set mieDirectionalG(v) { this.material.uniforms.mieDirectionalG.value = v; }
    get elevation() { return __classPrivateFieldGet(this, _SkyActor_elevation, "f"); }
    set elevation(v) { __classPrivateFieldSet(this, _SkyActor_elevation, v, "f"); this.updateSunPosition(); }
    get azimuth() { return __classPrivateFieldGet(this, _SkyActor_azimuth, "f"); }
    set azimuth(v) { __classPrivateFieldSet(this, _SkyActor_azimuth, v, "f"); this.updateSunPosition(); }
    constructor() {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SkyActor"
        });
        _SkyActor_sunPosition.set(this, new Three.Vector3());
        _SkyActor_elevation.set(this, 2);
        _SkyActor_azimuth.set(this, 180);
        this.object3d = new Sky();
        this.sky.scale.setScalar(450000);
    }
    updateSunPosition() {
        const phi = Three.MathUtils.degToRad(90 - __classPrivateFieldGet(this, _SkyActor_elevation, "f"));
        const theta = Three.MathUtils.degToRad(__classPrivateFieldGet(this, _SkyActor_azimuth, "f"));
        __classPrivateFieldGet(this, _SkyActor_sunPosition, "f").setFromSphericalCoords(1, phi, theta);
        this.material.uniforms.sunPosition.value.copy(__classPrivateFieldGet(this, _SkyActor_sunPosition, "f"));
        this.scene?.getComponentsByTag(SkyDirectionalLightTag).forEach(sunTracker => {
            if (isActor(sunTracker)) {
                if (sunTracker.object3d instanceof Three.DirectionalLight) {
                    sunTracker.object3d.position.copy(__classPrivateFieldGet(this, _SkyActor_sunPosition, "f"));
                    sunTracker.object3d.updateMatrix();
                }
            }
        });
        this.sky.material.needsUpdate = true;
        this.sky.matrixWorldNeedsUpdate = true;
    }
    onStart() {
        this.updateSunPosition();
    }
    get sky() { return this.object3d; }
    get material() { return this.sky.material; }
}
_SkyActor_sunPosition = new WeakMap(), _SkyActor_elevation = new WeakMap(), _SkyActor_azimuth = new WeakMap();
