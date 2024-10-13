import { Actor } from "../Scene/Actor";
import * as Three from "three";
export declare class OrthographicCameraActor extends Actor<Three.OrthographicCamera> {
    #private;
    type: string;
    set left(value: number);
    get left(): number;
    set right(value: number);
    get right(): number;
    set top(value: number);
    get top(): number;
    set bottom(value: number);
    get bottom(): number;
    set near(value: number);
    get near(): number;
    set far(value: number);
    get far(): number;
    get zoom(): number;
    set zoom(value: number);
    get debug(): boolean;
    set debug(value: boolean);
    constructor();
    onResize(x: number, y: number): void;
}
