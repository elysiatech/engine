import { ActiveCameraTag } from "../Core/Tags";

/**
 * @internal
 * Collect mouse intersections with actors.
 */
export class MouseIntersections {

	/**
	 * A set of Actors that the mouse is currently intersecting with
	 */
	public readonly intersections = new Set<any>

	/**
	 * Cast a ray from the mouse position and get intersections with actors
	 * @param scene
	 */
	public cast(scene: any, x: number, y: number)
	{
		this.intersections.clear()
		const camera = scene.getByTag(ActiveCameraTag)[0]
		if(!camera) return
		// todo: raycast and get intersections
	}
}