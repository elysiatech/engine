import * as Three from "three"
import { Actor } from "./Actor";
import { SceneActor } from "../Actors/SceneActor";

export class PointerIntersections {

	public readonly intersections = new Set<Actor>();

	public cast(pointer: Three.Vector2, camera: Three.Camera, scene: SceneActor) {
		this.raycaster.setFromCamera(pointer, camera);
		for (const i of this.raycaster.intersectObjects(scene.object3d.children)) {
			if (i.object.userData.owner)
				this.intersections.add(i.object.userData.owner);
		}
	}

	private raycaster = new Three.Raycaster();
}