import { Behavior } from "../behavior";

export class SpinBehavior extends Behavior {
	x: number;
	y: number;
	z: number;

	constructor(args: { x?: number; y?: number; z?: number } = {}) {
		super();
		this.x = args.x ?? 1;
		this.y = args.y ?? 1;
		this.z = args.z ?? 1;
	}

	onUpdate(frametime: number, elapsedtime: number) {
		super.onUpdate(frametime, elapsedtime);
		if (!this.parent) return;
		this.parent.rotation.x += 0.5 * this.x * frametime;
		this.parent.rotation.y += 0.5 * this.y * frametime;
		this.parent.rotation.z += 0.5 * this.z * frametime;
		this.parent.object3d.updateMatrix();
	}
}
