import * as Three from "three";
import { Actor } from "../Scene/Actor";
export class OrthographicCameraActor extends Actor {
    object3d;
    #left;
    get left() {
        return this.#left;
    }
    set left(value) {
        this.#left = value;
        this.object3d.left = value;
        this.object3d.updateProjectionMatrix();
    }
    #right;
    get right() {
        return this.#right;
    }
    set right(value) {
        this.#right = value;
        this.object3d.right = value;
        this.object3d.updateProjectionMatrix();
    }
    #top;
    get top() {
        return this.#top;
    }
    set top(value) {
        this.#top = value;
        this.object3d.top = value;
        this.object3d.updateProjectionMatrix();
    }
    #bottom;
    get bottom() {
        return this.#bottom;
    }
    set bottom(value) {
        this.#bottom = value;
        this.object3d.bottom = value;
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
        this.#left = settings.left ?? -1;
        this.#right = settings.right ?? 1;
        this.#top = settings.top ?? 1;
        this.#bottom = settings.bottom ?? -1;
        this.#near = settings.near ?? 0.1;
        this.#far = settings.far ?? 1000;
        this.object3d = new Three.OrthographicCamera(this.#left, this.#right, this.#top, this.#bottom, this.#near, this.#far);
        this.object3d.userData.owner = this;
    }
    onCreate() {
        super.onCreate();
        const renderTarget = this.scene.game.renderPipeline.getRenderer().domElement;
        const aspect = renderTarget.clientWidth / renderTarget.clientHeight;
        this.object3d.left = this.#left * aspect;
        this.object3d.right = this.#right * aspect;
        this.object3d.top = this.#top;
        this.object3d.bottom = this.#bottom;
        this.object3d.updateProjectionMatrix();
    }
    onResize(b) {
        const renderTarget = this.scene.game.renderPipeline.getRenderer().domElement;
        const aspect = renderTarget.clientWidth / renderTarget.clientHeight;
        this.object3d.left = this.#left * aspect;
        this.object3d.right = this.#right * aspect;
        this.object3d.top = this.#top;
        this.object3d.bottom = this.#bottom;
        this.object3d.updateProjectionMatrix();
    }
}
