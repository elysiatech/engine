import { Actor } from "../Scene/Actor";
import * as Three from "three";
export declare class PointLightActor extends Actor<Three.PointLight> {
    #private;
    type: string;
    get intensity(): number;
    set intensity(value: number);
    get color(): Three.Color;
    set color(value: Three.Color);
    get distance(): number;
    set distance(value: number);
    get decay(): number;
    set decay(value: number);
    get shadow(): any;
    get power(): number;
    set power(value: number);
    get castShadow(): boolean;
    set castShadow(value: boolean);
    get debug(): boolean;
    set debug(value: boolean);
    constructor(color?: Three.Color, intensity?: number, distance?: number, decay?: number);
}
