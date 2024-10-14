import { Actor } from "../Scene/Actor.js";
import * as Three from "three";
export class DebugActor extends Actor {
    static Debug(a) {
        const d = new DebugActor;
        a.addComponent(d);
        return d;
    }
    onEnterScene() {
        super.onEnterScene();
        this.object3d.add(this.#debugMesh = new Three.BoxHelper(this.parent.object3d, 0xffff00));
        this.object3d.add(this.#axis = new Three.AxesHelper(5));
    }
    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);
        this.#debugMesh?.update(this.parent.object3d);
    }
    onLeaveScene() {
        super.onLeaveScene();
        this.#debugMesh?.dispose();
        this.#debugMesh = undefined;
        this.#axis?.dispose();
        this.#axis = undefined;
    }
    #debugMesh;
    #axis;
}
