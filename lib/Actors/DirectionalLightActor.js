import { Actor } from "../Scene/Actor";
import * as Three from "three";
export class DirectionalLightActor extends Actor {
    type = "DirectionalLightActor";
    get intensity() { return this.object3d.intensity; }
    set intensity(value) { this.object3d.intensity = value; }
    get color() { return this.object3d.color; }
    set color(value) { this.object3d.color = value; }
    get target() { return this.object3d.target; }
    set target(value) { this.object3d.target = value; }
    get castShadow() { return this.object3d.castShadow; }
    set castShadow(value) { this.object3d.castShadow = value; }
    get shadowConfig() { return this.object3d.shadow; }
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
