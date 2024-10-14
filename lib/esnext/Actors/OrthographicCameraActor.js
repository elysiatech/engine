import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class OrthographicCameraActor extends Actor {
    type = "OrthographicCameraActor";
    set left(value) { this.object3d.left = value; }
    get left() { return this.object3d.left; }
    set right(value) { this.object3d.right = value; }
    get right() { return this.object3d.right; }
    set top(value) { this.object3d.top = value; }
    get top() { return this.object3d.top; }
    set bottom(value) { this.object3d.bottom = value; }
    get bottom() { return this.object3d.bottom; }
    set near(value) { this.object3d.near = value; }
    get near() { return this.object3d.near; }
    set far(value) { this.object3d.far = value; }
    get far() { return this.object3d.far; }
    get zoom() { return this.object3d.zoom; }
    set zoom(value) { this.object3d.zoom = value; }
    get debug() { return this.#debug; }
    set debug(value) {
        this.#debug = value;
        if (value) {
            this.#debugHelper ??= new Three.CameraHelper(this.object3d);
            this.object3d.add(this.#debugHelper);
        }
        else {
            this.#debugHelper?.parent?.remove(this.#debugHelper);
            this.#debugHelper?.dispose();
            this.#debugHelper = undefined;
        }
    }
    constructor() {
        super();
        this.object3d = new Three.OrthographicCamera();
    }
    onResize(x, y) {
        const aspect = x / y;
        this.object3d.left = -1 * aspect;
        this.object3d.right = aspect;
        this.object3d.top = 1;
        this.object3d.bottom = -1;
        this.object3d.updateProjectionMatrix();
    }
    #debug = false;
    #debugHelper;
}
