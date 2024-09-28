import { Actor } from "../Scene/Actor";
import * as Three from "three";
import { GLTF } from "three-stdlib";

export class ModelActor extends Actor
{
	get castShadow() { return this.object3d.castShadow; }
	set castShadow(value) { this.object3d.castShadow = value; }

	get receiveShadow() { return this.object3d.receiveShadow; }
	set receiveShadow(value) { this.object3d.receiveShadow = value; }

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

	constructor(model: GLTF | Three.Object3D, castShadow = true, receiveShadow = true)
	{
		super();
		if(model instanceof Three.Object3D)
		{
			this.object3d = model;
		}
		else if ('scene' in model)
		{
			this.object3d = model.scene;
		}
		else
		{
			throw new Error("Invalid model");
		}
		this.object3d.actor = this;
	}

	#debug = false;
	#debugHelper?: Three.BoxHelper;
}