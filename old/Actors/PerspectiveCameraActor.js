import * as Three from "three";
import { Actor } from "../Scene/Actor";
export class PerspectiveCameraActor extends Actor {
    object3d;
    #fov;
    get fov() {
        return this.#fov;
    }
    set fov(value) {
        this.#fov = value;
        this.object3d.fov = value;
        this.object3d.updateProjectionMatrix();
    }
    #near;
    get near() {
        return this.#near;
    }
    set near(value) {
        this.#near = value;
        this.object3d.near = value;
        this.object3d.updateProjectionMatrix();
    }
    #far;
    get far() {
        return this.#far;
    }
    set far(value) {
        this.#far = value;
        this.object3d.far = value;
        this.object3d.updateProjectionMatrix();
    }
    constructor(settings = {}) {
        super();
        this.#fov = settings.fov ?? 75;
        this.#near = settings.near ?? 0.1;
        this.#far = settings.far ?? 1000;
        this.object3d = new Three.PerspectiveCamera(this.#fov, 1, this.#near, this.#far);
        this.object3d.userData.owner = this;
    }
    onCreate() {
        super.onCreate();
        const renderTarget = this.scene.game.renderPipeline.getRenderer().domElement;
        this.object3d.aspect = renderTarget.clientWidth / renderTarget.clientHeight;
        this.object3d.updateProjectionMatrix();
    }
    onResize(b) {
        const renderTarget = this.scene.game.renderPipeline.getRenderer().domElement;
        this.object3d.aspect = renderTarget.clientWidth / renderTarget.clientHeight;
        this.object3d.updateProjectionMatrix();
    }
}
