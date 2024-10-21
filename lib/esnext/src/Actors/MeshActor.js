import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class MeshActor extends Actor {
    type = "MeshActor";
    get geometry() { return this.object3d.geometry; }
    set geometry(value) { this.object3d.geometry = value; }
    get material() { return this.object3d.material; }
    set material(value) { this.object3d.material = value; }
    get castShadow() { return this.object3d.castShadow; }
    set castShadow(value) { this.object3d.castShadow = value; }
    get receiveShadow() { return this.object3d.receiveShadow; }
    set receiveShadow(value) { this.object3d.receiveShadow = value; }
    get debug() { return this.#debug; }
    set debug(value) {
        if (value) {
            this.#debugHelper ??= new Three.BoxHelper(this.object3d, "red");
            this.object3d.add(this.#debugHelper);
        }
        else {
            this.#debugHelper?.parent?.remove(this.#debugHelper);
            this.#debugHelper?.dispose();
            this.#debugHelper = undefined;
        }
        this.#debug = value;
    }
    constructor(geometry, material, castShadow = true, receiveShadow = true) {
        super();
        this.object3d = new Three.Mesh(geometry, material);
        this.castShadow = castShadow;
        this.receiveShadow = receiveShadow;
    }
    #debug = false;
    #debugHelper;
}
