import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class PerspectiveCameraActor extends Actor {
    type = "PerspectiveCameraActor";
    get fov() { return this.object3d.fov; }
    set fov(fov) {
        this.object3d.fov = fov;
        this.object3d.updateProjectionMatrix();
    }
    get aspect() { return this.object3d.aspect; }
    set aspect(aspect) {
        this.object3d.aspect = aspect;
        this.object3d.updateProjectionMatrix();
    }
    get near() { return this.object3d.near; }
    set near(near) { this.object3d.near = near; }
    get far() { return this.object3d.far; }
    set far(far) { this.object3d.far = far; }
    get zoom() { return this.object3d.zoom; }
    set zoom(zoom) { this.object3d.zoom = zoom; }
    get focus() { return this.object3d.focus; }
    set focus(focus) { this.object3d.focus = focus; }
    get filmGauge() { return this.object3d.filmGauge; }
    set filmGauge(filmGauge) { this.object3d.filmGauge = filmGauge; }
    get filmOffset() { return this.object3d.filmOffset; }
    set filmOffset(filmOffset) { this.object3d.filmOffset = filmOffset; }
    get view() { return this.object3d.view; }
    set view(view) { this.object3d.view = view; }
    get debug() { return this.#debug; }
    set debug(value) {
        this.#debug = value;
        if (value) {
            this.#debugHelper ??= new Three.CameraHelper(this.object3d);
            this.scene?.object3d.add(this.#debugHelper);
        }
        else {
            this.#debugHelper?.removeFromParent();
            this.#debugHelper?.dispose();
            this.#debugHelper = undefined;
        }
    }
    constructor() {
        super();
        this.onResize = this.onResize.bind(this);
        this.object3d = new Three.PerspectiveCamera();
    }
    onCreate() {
        if (this.debug)
            this.scene.object3d.add(this.#debugHelper);
    }
    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);
        if (this.debug)
            this.#debugHelper?.update();
    }
    onDestroy() {
        this.#debugHelper?.dispose();
    }
    onResize(x, y) {
        this.object3d.aspect = x / y;
        this.object3d.updateProjectionMatrix();
    }
    #debug = false;
    #debugHelper;
}
