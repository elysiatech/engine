import * as Three from "three";
import { Actor } from "../actor";

export class MeshActor<
	T extends Three.Mesh = Three.Mesh,
> extends Actor<Three.Mesh> {
	override object3d = new Three.Mesh();

	#geometry: Three.BufferGeometry;

	get geometry() {
		return this.#geometry;
	}

	set geometry(value: Three.BufferGeometry) {
		this.#geometry = value;
		this.#geometry.userData.owner = this;
		this.object3d.geometry = value;
	}

	#material: Three.Material;

	get material() {
		return this.#material;
	}

	set material(value: Three.Material) {
		this.#material = value;
		this.object3d.material = value;
	}

	constructor(geometry: Three.BufferGeometry, material: Three.Material) {
		super();
		this.#geometry = geometry;
		this.#geometry.userData.owner = this;
		this.#material = material;
		this.object3d.geometry = geometry;
		this.object3d.material = material;
	}
}
