import Three from "three"

export class Actor<T extends Three.Object3D> {
	object3d: T = new Three.Object3D as T;
}