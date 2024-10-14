import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class PointLightActor extends Actor {
    type = "PointLightActor";
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
    get debug() { return this.#debug; }
    set debug(value) {
        this.#debug = value;
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
        this.object3d = new Three.PointLight(color, intensity, distance, decay);
        this.object3d.actor = this;
        this.castShadow = true;
    }
    #debug = false;
}
