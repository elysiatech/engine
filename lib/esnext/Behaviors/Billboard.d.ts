import { Behavior } from "../Scene/Behavior.ts";
/**
 * A behavior that makes the s_Parent object always face the camera.
 */
export declare class BillboardBehavior extends Behavior {
    #private;
    type: string;
    /**
     * Lock the rotation on the X axis.
     * @default false
     */
    get lockX(): boolean;
    set lockX(value: boolean);
    /**
     * Lock the rotation on the Y axis.
     * @default false
     */
    get lockY(): boolean;
    set lockY(value: boolean);
    /**
     * Lock the rotation on the Z axis.
     * @default false
     */
    get lockZ(): boolean;
    set lockZ(value: boolean);
    onUpdate(delta: number, elapsed: number): void;
}
