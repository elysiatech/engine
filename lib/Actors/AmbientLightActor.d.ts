import { Actor } from "../Scene/Actor";
import * as Three from "three";
export declare class AmbientLightActor extends Actor<Three.AmbientLight> {
    type: string;
    get intensity(): number;
    set intensity(value: number);
    get color(): Three.Color;
    set color(value: Three.Color);
    get castShadow(): boolean;
    set castShadow(value: boolean);
    constructor(intensity?: number, color?: Three.Color);
}
