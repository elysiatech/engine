import * as Three from "three";
/**
 * @internal
 * Collect mouse intersections with actors.
 */
export declare class MouseIntersections {
    /**
     * A set of Actors that the mouse is currently intersecting with
     */
    readonly intersections: Set<any>;
    /**
     * Cast a ray from the mouse position and get intersections with actors
     * @param scene
     */
    cast(camera: Three.Camera, scene: Three.Scene, x: number, y: number): void;
    private vec2;
    private raycaster;
}
