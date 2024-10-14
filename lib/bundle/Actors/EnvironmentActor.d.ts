import * as Three from "three";
import { Actor } from "../Scene/Actor.ts";
import { Scene } from 'three';
declare class RoomEnvironment extends Scene {
    constructor();
}
export { RoomEnvironment };
type EnvironmentArgs = {
    texture?: Three.Texture | Three.CubeTexture;
    envScene?: Three.Scene;
    rotation?: Three.Euler;
    environmentIntensity?: number;
    background?: boolean;
    backgroundIntensity?: number;
    backgroundBlur?: number;
};
export declare class EnvironmentActor extends Actor {
    #private;
    type: string;
    get texture(): Three.Texture | Three.CubeTexture | null;
    set texture(v: Three.Texture | Three.CubeTexture | null);
    get envScene(): Three.Scene | null;
    set envScene(v: Three.Scene | null);
    get rotation(): Three.Euler;
    set rotation(v: Three.Euler);
    get intensity(): number;
    set intensity(v: number);
    get background(): boolean;
    set background(v: boolean);
    get backgroundIntensity(): number;
    set backgroundIntensity(v: number);
    get backgroundBlur(): number;
    set backgroundBlur(v: number);
    constructor(args?: EnvironmentArgs);
    updateState(): void;
    onCreate(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
}
