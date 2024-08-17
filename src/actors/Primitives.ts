import * as Three from "three";
import { Actor } from "../actor";

const PRIMITIVE_COLOR = "#c4c4c4";

type PrimitiveMeshMaterial =
	| Three.MeshStandardMaterial
	| Three.MeshBasicMaterial
	| Three.MeshLambertMaterial
	| Three.MeshMatcapMaterial
	| Three.MeshPhongMaterial
	| Three.MeshPhysicalMaterial
	| Three.MeshToonMaterial;

type PrimitiveArgs = {
	material?: PrimitiveMeshMaterial;
	color?: string | Three.Color;
	position?: Three.Vector3;
	rotation?: Three.Euler;
	scale?: Three.Vector3;
};

export class PrimitiveCubeActor extends Actor<Three.Mesh> {
	override object3d: Three.Mesh;

	#material: PrimitiveMeshMaterial;

	get material() {
		return this.#material;
	}

	set material(value: PrimitiveMeshMaterial) {
		this.#material = value;
		this.object3d.material = value;
	}

	#color: string | Three.Color = PRIMITIVE_COLOR;

	get color() {
		return this.#color;
	}

	set color(value: string | Three.Color) {
		this.#color = value;
		this.#material.color = new Three.Color(value);
	}

	constructor(args: PrimitiveArgs = {}) {
		super();

		if (args.color) {
			this.#color = args.color;
		}

		if (args.material) {
			this.#material = args.material;
		} else {
			this.#material = new Three.MeshStandardMaterial({ color: this.#color });
		}

		this.object3d = new Three.Mesh(
			new Three.BoxGeometry(1, 1, 1),
			this.#material,
		);

		if (args.position) {
			this.position.copy(args.position);
		}

		if (args.rotation) {
			this.rotation.copy(args.rotation);
		}

		if (args.scale) {
			this.scale.copy(args.scale);
		}

		this.object3d.userData.owner = this;
	}
}
