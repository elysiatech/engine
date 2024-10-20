import { Actor } from "../Scene/Actor.ts";
import * as Three from "three";
/**
 * A directional light actor.
 */
export declare class DirectionalLightActor extends Actor<Three.DirectionalLight> {
    #private;
    type: string;
    /** The light intensity. */
    get intensity(): number;
    set intensity(value: number);
    /** The light color. */
    get color(): Three.Color;
    set color(value: Three.Color);
    /** Where the light points to. */
    get target(): Three.Object3D;
    set target(value: Three.Object3D);
    /**
     * Whether the light casts shadows.
     * @default true
     */
    get castShadow(): boolean;
    set castShadow(value: boolean);
    /** The underlying Three.DirectionalLightShadow. */
    get shadowConfig(): Three.DirectionalLightShadow;
    /** Should the actor render a debug helper. */
    get debug(): boolean;
    set debug(value: boolean);
    /**
     * Creates a new directional light actor.
     * @param intensity - The light intensity.
     * @param color - The light color.
     * @param target - Where the light points to.
     * @param castShadow - Whether the light casts shadows.
     */
    constructor(intensity?: number, color?: Three.Color, target?: Three.Object3D, castShadow?: boolean);
    onUpdate(delta: number, elapsed: number): void;
}
