import * as Three from "three";
import { Behavior } from "../behavior";

type FloatArgs = {
	offset?: number;
	enabled?: boolean;
	speed?: number;
	rotationIntensity?: number;
	floatIntensity?: number;
	floatingRange?: [number, number];
};

export class FloatBehavior extends Behavior {
	#offset: number;

	enabled: boolean;
	speed: number;
	rotationIntensity: number;
	floatIntensity: number;
	floatingRange: [number, number];

	constructor(args: FloatArgs = {}) {
		super();
		this.#offset = args.offset ?? Math.random() * 10000;
		this.enabled = args.enabled ?? true;
		this.speed = args.speed ?? 1;
		this.rotationIntensity = args.rotationIntensity ?? 1;
		this.floatIntensity = args.floatIntensity ?? 1;
		this.floatingRange = args.floatingRange ?? [-0.1, 0.1];
	}

	onUpdate(frametime: number, elapsedtime: number) {
		super.onUpdate(frametime, elapsedtime);
		if (!this.enabled || this.speed === 0 || !this.parent) return;
		const t = this.#offset + elapsedtime;
		this.parent.rotation.x =
			(Math.cos((t / 4) * this.speed * 2) / 8) * this.rotationIntensity;
		this.parent.rotation.y =
			(Math.sin((t / 4) * this.speed * 2) / 8) * this.rotationIntensity;
		this.parent.rotation.z =
			(Math.sin((t / 4) * this.speed * 2) / 20) * this.rotationIntensity;
		let yPosition = Math.sin((t / 4) * this.speed * 2) / 10;
		yPosition = Three.MathUtils.mapLinear(
			yPosition,
			-0.1,
			0.1,
			this.floatingRange?.[0] ?? -0.1,
			this.floatingRange?.[1] ?? 0.1,
		);
		this.parent.position.y = yPosition * this.floatIntensity;
		this.parent.object3d.updateMatrix();
	}
}
