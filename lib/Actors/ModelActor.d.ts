import { Actor } from "../Scene/Actor";
import * as Three from "three";
import { type GLTF } from "three-stdlib";
/**
 * A model actor is an actor that represents a 3D model, usually loaded from a GLTF file.
 */
export declare class ModelActor extends Actor {
    #private;
    type: string;
    /**
     * Should this model cast shadows?
     */
    get castShadow(): any;
    set castShadow(value: any);
    /**
     * Should this model receive shadows?
     */
    get receiveShadow(): any;
    set receiveShadow(value: any);
    /**
     * A debug flag that will show a bounding box around the model.
     */
    get debug(): boolean;
    set debug(value: boolean);
    constructor(model: GLTF);
    getAction(name: string): Three.AnimationAction | undefined;
    loadModel(model: GLTF): void;
    onUpdate(delta: number, elapsed: number): void;
    protected clips: Three.AnimationClip[];
    protected mixer?: Three.AnimationMixer;
}
