import { Actor } from "../Scene/Actor";
import * as Three from "three";
import { Sky } from "three-stdlib";
import { isActor } from "../Scene/Component";
export const SkyDirectionalLightTag = Symbol.for("Elysia::SkyDirectionalLight");
export class SkyActor extends Actor {
    type = "SkyActor";
    get turbidity() { return this.material.uniforms.turbidity.value; }
    set turbidity(v) { this.material.uniforms.turbidity.value = v; }
    get rayleigh() { return this.material.uniforms.rayleigh.value; }
    set rayleigh(v) { this.material.uniforms.rayleigh.value = v; }
    get mieCoefficient() { return this.material.uniforms.mieCoefficient.value; }
    set mieCoefficient(v) { this.material.uniforms.mieCoefficient.value = v; }
    get mieDirectionalG() { return this.material.uniforms.mieDirectionalG.value; }
    set mieDirectionalG(v) { this.material.uniforms.mieDirectionalG.value = v; }
    get elevation() { return this.#elevation; }
    set elevation(v) { this.#elevation = v; this.updateSunPosition(); }
    get azimuth() { return this.#azimuth; }
    set azimuth(v) { this.#azimuth = v; this.updateSunPosition(); }
    constructor() {
        super();
        this.object3d = new Sky();
        this.sky.scale.setScalar(450000);
    }
    updateSunPosition() {
        const phi = Three.MathUtils.degToRad(90 - this.#elevation);
        const theta = Three.MathUtils.degToRad(this.#azimuth);
        this.#sunPosition.setFromSphericalCoords(1, phi, theta);
        this.material.uniforms.sunPosition.value.copy(this.#sunPosition);
        this.scene?.getComponentsByTag(SkyDirectionalLightTag).forEach(sunTracker => {
            if (isActor(sunTracker)) {
                if (sunTracker.object3d instanceof Three.DirectionalLight) {
                    sunTracker.object3d.position.copy(this.#sunPosition);
                    sunTracker.object3d.updateMatrix();
                }
            }
        });
    }
    onStart() { this.updateSunPosition(); }
    get sky() { return this.object3d; }
    get material() { return this.sky.material; }
    #sunPosition = new Three.Vector3();
    #elevation = 2;
    #azimuth = 180;
}
