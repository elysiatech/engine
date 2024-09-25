import { Actor } from "../Scene/Actor";
import * as Three from "three";

export class OrthographicCameraActor extends Actor<Three.OrthographicCamera>
{
	set left(value: number) { this.object3d.left = value; }
	get left() { return this.object3d.left; }

	set right(value: number) { this.object3d.right = value; }
	get right() { return this.object3d.right; }

	set top(value: number) { this.object3d.top = value; }
	get top() { return this.object3d.top; }

	set bottom(value: number) { this.object3d.bottom = value; }
	get bottom() { return this.object3d.bottom; }

	set near(value: number) { this.object3d.near = value; }
	get near() { return this.object3d.near; }

	set far(value: number) { this.object3d.far = value; }
	get far() { return this.object3d.far; }

	get zoom() { return this.object3d.zoom; }
	set zoom(value: number) { this.object3d.zoom = value; }

	constructor() {
		super();
		this.object3d = new Three.OrthographicCamera();
	}
}