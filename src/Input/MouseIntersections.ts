import { ActiveCameraTag } from "../Core/Tags.ts";
import * as Three from "three";
import { Scene } from "../Scene/Scene.ts";

/**
 * @internal
 * Collect mouse intersections with actors.
 */
export class MouseIntersections
{

	/**
	 * A set of Actors that the mouse is currently intersecting with
	 */
	public readonly intersections = new Set<any>

	/**
	 * Cast a ray from the mouse position and get intersections with actors
	 * @param scene
	 */
	public cast(camera: Three.Camera, scene: Three.Scene, x: number, y: number)
	{
		this.intersections.clear()

		this.vec2.x = x
		this.vec2.y = y

		// this.raycaster.setFromCamera(this.vec2, camera)

		// const intersects = this.raycaster.intersectObjects(scene.children, true)

		// for(const intersection of intersects)
		// {
		// 	const actor = intersection.object.actor
		// 	if(actor)
		// 	{
		// 		this.intersections.add(actor)
		// 	}
		// }
	}

	private vec2 = new Three.Vector2;
	private raycaster = new Three.Raycaster;
}