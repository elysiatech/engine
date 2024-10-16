import { Actor } from "../Scene/Actor.ts";
import * as Three from "three";
export declare class PerspectiveCameraActor extends Actor<Three.PerspectiveCamera> {
    #private;
    type: string;
    get fov(): number;
    set fov(fov: number);
    get aspect(): number;
    set aspect(aspect: number);
    get near(): number;
    set near(near: number);
    get far(): number;
    set far(far: number);
    get zoom(): number;
    set zoom(zoom: number);
    get focus(): number;
    set focus(focus: number);
    get filmGauge(): number;
    set filmGauge(filmGauge: number);
    get filmOffset(): number;
    set filmOffset(filmOffset: number);
    get view(): any;
    set view(view: any);
    get debug(): boolean;
    set debug(value: boolean);
    constructor();
    onCreate(): void;
    onUpdate(delta: number, elapsed: number): void;
    onDestroy(): void;
    onResize(x: number, y: number): void;
}
