import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class AmbientLightActor extends Actor {
    get intensity() { return this.object3d.intensity; }
    set intensity(value) { this.object3d.intensity = value; }
    get color() { return this.object3d.color; }
    set color(value) { this.object3d.color = value; }
    get castShadow() { return this.object3d.castShadow; }
    set castShadow(value) { this.object3d.castShadow = value; }
    constructor(intensity, color) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AmbientLightActor"
        });
        this.object3d = new Three.AmbientLight(color, intensity);
        this.object3d.actor = this;
    }
}
