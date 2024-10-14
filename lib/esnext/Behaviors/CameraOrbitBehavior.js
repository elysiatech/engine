import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Behavior } from "../Scene/Behavior.js";
import { ELYSIA_LOGGER } from "../Core/Logger.js";
import { isOrthographicCamera, isPerspectiveCamera } from "../Core/Asserts.js";
/**
 * Implements the standard orbit controls for a camera.
 */
export class CameraOrbitBehavior extends Behavior {
    type = 'CameraOrbitBehavior';
    controls;
    /**
     * Whether the camera should be damped smooth or not.
     * @default false
     */
    get smooth() { return this.controls?.enableDamping ?? false; }
    set smooth(value) {
        if (this.controls)
            this.controls.enableDamping = value;
        this.#smooth = value;
    }
    onCreate() {
        super.onCreate();
        const camera = this.parent?.object3d;
        if (!camera) {
            ELYSIA_LOGGER.error("No camera found to attach orbit controls to", this.parent);
            return;
        }
        if (!isPerspectiveCamera(camera) && !isOrthographicCamera(camera)) {
            ELYSIA_LOGGER.error("Camera is not a Perspective or Orthographic camera", camera);
            return;
        }
        this.controls = new OrbitControls(camera, this.app.renderPipeline.getRenderer().domElement);
        this.controls.enableDamping = this.#smooth;
    }
    onUpdate() {
        if (this.controls) {
            this.controls.update();
        }
    }
    #smooth = false;
}
