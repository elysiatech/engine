import { Actor } from "../Scene/Actor.ts";
import * as Three from "three";
import { type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { bound } from "../Core/Utilities.ts";

/**
 * A model actor is an actor that represents a 3D model, usually loaded from a GLTF file.
 */
export class ModelActor extends Actor
{
	override type = "ModelActor";

	/**
	 * Should this model cast shadows?
	 */
	get castShadow() { return this.object3d.castShadow; }
	set castShadow(value) { this.object3d.castShadow = value; this.object3d.traverse(x => x.castShadow = value ) }

	/**
	 * Should this model receive shadows?
	 */
	get receiveShadow() { return this.object3d.receiveShadow; }
	set receiveShadow(value) { this.object3d.receiveShadow = value; }

	/**
	 * A debug flag that will show a bounding box around the model.
	 */
	get debug() { return this.#debug; }
	set debug(value)
	{
		if(value)
		{
			this.#debugHelper ??= new Three.BoxHelper(this.object3d, "red");
			this.object3d.add(this.#debugHelper);
		}
		else
		{
			this.#debugHelper?.parent?.remove(this.#debugHelper);
			this.#debugHelper?.dispose();
			this.#debugHelper = undefined;
		}
		this.#debug = value;
	}

	constructor(model: GLTF)
	{
		super();
		this.loadModel(model);
	}

	@bound public getAction(name: string)
	{
		const clip = Three.AnimationClip.findByName(this.clips, name);
		return this.mixer?.clipAction(clip);
	}

	@bound loadModel(model?: GLTF)
	{
		const clips = model?.animations ?? [];
		const scene = model?.scene ?? model?.scenes[0];

		this.object3d = scene ?? new Three.Group();

		this.clips = clips;

		if (this.mixer) {
			this.mixer.stopAllAction();
			this.mixer.uncacheRoot(this.mixer.getRoot());
			this.mixer = undefined;
		}

		if(clips.length > 0)
		{
			this.mixer = new Three.AnimationMixer(this.object3d);
		}
	}

	@bound onUpdate(delta: number, elapsed: number)
	{
		this.mixer?.update(delta);
	}

	protected clips: Three.AnimationClip[] = [];
	protected mixer?: Three.AnimationMixer;

	#debug = false;
	#debugHelper?: Three.BoxHelper;
}