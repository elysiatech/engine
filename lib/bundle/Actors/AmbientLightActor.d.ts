import { Actor } from "../Scene/Actor.ts";
import * as Three from "three";
/** An actor wrapping Three.AmbientLight. Setting transform properties will have no effect on this actor.n*/
export declare class AmbientLightActor extends Actor<Three.AmbientLight> {
    type: string;
    /** The intensity of the ambient light. */
    get intensity(): number;
    set intensity(value: number);
    /** The color of the ambient light. */
    get color(): Three.Color;
    set color(value: Three.Color);
    /**
        * Create a new AmbientLightActor.
        * @param intensity The intensity of the ambient light.
        * @param color The color of the ambient light.
    */
    constructor(intensity?: number, color?: Three.Color);
}
