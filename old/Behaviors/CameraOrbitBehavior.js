import { OrbitControls } from "three-stdlib";
import { PerspectiveCameraActor } from "../Actors/PerspectiveCameraActor";
import { Behavior } from "../Scene/Behavior";
export class CameraOrbitBehavior extends Behavior {
    controls = null;
    onCreate() {
        super.onCreate();
        if (!(this.parent instanceof PerspectiveCameraActor))
            return;
        const renderer = this.scene.game.renderPipeline.getRenderer();
        this.controls = new OrbitControls(this.parent.object3d, renderer.domElement);
    }
    onUpdate(frametime, elapsedtime) {
        super.onUpdate(frametime, elapsedtime);
        this.controls.update();
    }
}
