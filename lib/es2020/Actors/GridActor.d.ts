/** Based on
    https://github.com/Fyrestar/THREE.InfiniteGridHelper by https://github.com/Fyrestar
    and https://github.com/threlte/threlte/blob/main/packages/extras/src/lib/components/Grid/Grid.svelte
    by https://github.com/grischaerbe and https://github.com/jerzakm
 */
import * as Three from 'three';
import { Actor } from "../Scene/Actor.ts";
export interface GridConstructorArguments {
    /** Cell size, default: 0.5 */
    cellSize?: number;
    /** Cell thickness, default: 0.5 */
    cellThickness?: number;
    /** Cell color, default: black */
    cellColor?: Three.Color;
    /** Section size, default: 1 */
    sectionSize?: number;
    /** Section thickness, default: 1 */
    sectionThickness?: number;
    /** Section color, default: #2080ff */
    sectionColor?: Three.Color;
    /** Fade distance, default: 100 */
    fadeDistance?: number;
    /** Fade strength, default: 1 */
    fadeStrength?: number;
}
export declare class GridActor extends Actor<Three.Mesh> {
    type: string;
    /** Cell size, default: 0.5 */
    cellSize?: number;
    /** Cell thickness, default: 0.5 */
    cellThickness?: number;
    /** Cell color, default: black */
    cellColor?: Three.Color;
    /** Section size, default: 1 */
    sectionSize?: number;
    /** Section thickness, default: 1 */
    sectionThickness?: number;
    /** Section color, default: #2080ff */
    sectionColor?: Three.Color;
    /** Fade distance, default: 100 */
    fadeDistance?: number;
    /** Fade strength, default: 1 */
    fadeStrength?: number;
    /** Material side, default: THREE.BackSide */
    side?: Three.Side;
    plane: Three.Plane;
    upVector: Three.Vector3;
    zeroVector: Three.Vector3;
    constructor(props?: GridConstructorArguments);
    onUpdate(delta: number, elapsed: number): void;
}
