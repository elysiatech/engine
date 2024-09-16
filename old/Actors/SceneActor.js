import * as Three from "three";
import { Actor } from "../Scene/Actor";
export class SceneActor extends Actor {
    constructor() {
        super();
        this.object3d = new Three.Scene();
        this.object3d.userData.owner = this;
    }
}
