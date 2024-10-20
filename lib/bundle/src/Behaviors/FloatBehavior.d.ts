import { Behavior } from "../Scene/Behavior.ts";
type FloatArgs = {
    offset?: number;
    speed?: number;
    rotationIntensity?: number;
    floatIntensity?: number;
    floatingRange?: [number, number];
};
/** A behavior that makes an object smoothly float and rotate. */
export declare class FloatBehavior extends Behavior {
    #private;
    type: string;
    get offset(): number;
    set offset(value: number);
    get speed(): number;
    set speed(value: number);
    get rotationIntensity(): number;
    set rotationIntensity(value: number);
    get floatIntensity(): number;
    set floatIntensity(value: number);
    get floatingRange(): [number, number];
    set floatingRange(value: [number, number]);
    constructor(args?: FloatArgs);
    onUpdate(frametime: number, elapsedtime: number): void;
}
export {};
