import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Behavior } from "../Scene/Behavior.ts";
/**
 * Implements the standard orbit controls for a camera.
 */
export declare class CameraOrbitBehavior extends Behavior {
    #private;
    type: string;
    controls?: OrbitControls;
    /**
     * Whether the camera should be damped smooth or not.
     * @default false
     */
    get smooth(): boolean;
    set smooth(value: boolean);
    onCreate(): void;
    onUpdate(): void;
}
