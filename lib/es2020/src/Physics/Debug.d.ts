import * as Three from "three";
import Rapier from "@dimforge/rapier3d-compat";
export declare class PhysicsDebugRenderer {
    enabled: boolean;
    mesh?: Three.LineSegments;
    world?: Rapier.World;
    constructor(enabled?: boolean);
    start(scene: Three.Scene, world: Rapier.World): void;
    update(): void;
}
