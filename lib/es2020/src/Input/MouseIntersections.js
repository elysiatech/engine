import * as Three from "three";
/**
 * @internal
 * Collect mouse intersections with actors.
 */
export class MouseIntersections {
    constructor() {
        /**
         * A set of Actors that the mouse is currently intersecting with
         */
        Object.defineProperty(this, "intersections", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set
        });
        Object.defineProperty(this, "vec2", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Three.Vector2
        });
        Object.defineProperty(this, "raycaster", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Three.Raycaster
        });
    }
    /**
     * Cast a ray from the mouse position and get intersections with actors
     * @param scene
     */
    cast(camera, scene, x, y) {
        this.intersections.clear();
        this.vec2.x = x;
        this.vec2.y = y;
        // this.raycaster.setFromCamera(this.vec2, camera)
        // const intersects = this.raycaster.intersectObjects(s_Scene.children, true)
        // for(const intersection of intersects)
        // {
        // 	const actor = intersection.object.actor
        // 	if(actor)
        // 	{
        // 		this.intersections.add(actor)
        // 	}
        // }
    }
}
