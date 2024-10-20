import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
/**
 * A directional light actor.
 */
export class DirectionalLightActor extends Actor {
    type = "DirectionalLightActor";
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
    get debug() { return this.#debug; }
    set debug(value) {
        this.#debug = value;
        if (value) {
            this.#debugHelper ??= new Three.DirectionalLightHelper(this.object3d, 2, "red");
            this.object3d.add(this.#debugHelper);
        }
        else {
            this.#debugHelper?.parent?.remove(this.#debugHelper);
            this.#debugHelper?.dispose();
            this.#debugHelper = undefined;
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
        this.object3d = new Three.DirectionalLight(color, intensity);
        this.object3d.actor = this;
        if (target)
            this.object3d.target = target;
        this.castShadow = castShadow;
    }
    onUpdate(delta, elapsed) {
        this.#debug && this.#debugHelper?.update();
    }
    #debug = false;
    #debugHelper;
}
