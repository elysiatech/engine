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
var _DirectionalLightActor_debug, _DirectionalLightActor_debugHelper;
import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
/**
 * A directional light actor.
 */
export class DirectionalLightActor extends Actor {
    /** The light intensity. */
    get intensity() { return this.object3d.intensity; }
    set intensity(value) { this.object3d.intensity = value; }
    /** The light color. */
    get color() { return this.object3d.color; }
    set color(value) { this.object3d.color = value; }
    /** Where the light points to. */
    get target() { return this.object3d.target; }
    set target(value) { this.object3d.target = value; }
    /**
     * Whether the light casts shadows.
     * @default true
     */
    get castShadow() { return this.object3d.castShadow; }
    set castShadow(value) { this.object3d.castShadow = value; }
    /** The underlying Three.DirectionalLightShadow. */
    get shadowConfig() { return this.object3d.shadow; }
    /** Should the actor render a debug helper. */
    get debug() { return __classPrivateFieldGet(this, _DirectionalLightActor_debug, "f"); }
    set debug(value) {
        __classPrivateFieldSet(this, _DirectionalLightActor_debug, value, "f");
        if (value) {
            __classPrivateFieldSet(this, _DirectionalLightActor_debugHelper, __classPrivateFieldGet(this, _DirectionalLightActor_debugHelper, "f") ?? new Three.DirectionalLightHelper(this.object3d, 2, "red"), "f");
            this.object3d.add(__classPrivateFieldGet(this, _DirectionalLightActor_debugHelper, "f"));
        }
        else {
            __classPrivateFieldGet(this, _DirectionalLightActor_debugHelper, "f")?.parent?.remove(__classPrivateFieldGet(this, _DirectionalLightActor_debugHelper, "f"));
            __classPrivateFieldGet(this, _DirectionalLightActor_debugHelper, "f")?.dispose();
            __classPrivateFieldSet(this, _DirectionalLightActor_debugHelper, undefined, "f");
        }
    }
    /**
     * Creates a new directional light actor.
     * @param intensity - The light intensity.
     * @param color - The light color.
     * @param target - Where the light points to.
     * @param castShadow - Whether the light casts shadows.
     */
    constructor(intensity, color, target, castShadow = true) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "DirectionalLightActor"
        });
        _DirectionalLightActor_debug.set(this, false);
        _DirectionalLightActor_debugHelper.set(this, void 0);
        this.object3d = new Three.DirectionalLight(color, intensity);
        this.object3d.actor = this;
        if (target)
            this.object3d.target = target;
        this.castShadow = castShadow;
    }
    onUpdate(delta, elapsed) {
        __classPrivateFieldGet(this, _DirectionalLightActor_debug, "f") && __classPrivateFieldGet(this, _DirectionalLightActor_debugHelper, "f")?.update();
    }
}
_DirectionalLightActor_debug = new WeakMap(), _DirectionalLightActor_debugHelper = new WeakMap();
