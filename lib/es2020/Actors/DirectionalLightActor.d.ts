import { Actor } from "../Scene/Actor.ts";
import * as Three from "three";
export declare class DirectionalLightActor extends Actor<Three.DirectionalLight> {
    #private;
    type: string;
    get intensity(): number;
    set intensity(value: number);
    get color(): Three.Color;
    set color(value: Three.Color);
    get target(): Three.Object3D;
    set target(value: Three.Object3D);
    get castShadow(): boolean;
    set castShadow(value: boolean);
    get shadowConfig(): Three.DirectionalLightShadow;
    get debug(): boolean;
    set debug(value: boolean);
    constructor(intensity?: number, color?: Three.Color, target?: Three.Object3D, castShadow?: boolean);
    onUpdate(delta: number, elapsed: number): void;
}
