import { VectorLike } from "./Vectors";
/**
 * Improved lerp for smoothing that prevents overshoot and is frame rate independent.
 * - from https://theorangeduck.com/page/spring-roll-call
 * @param start - The value to start from. Can be a number or Vector.
 * @param end	- The value to end at. Can be a number or Vector.
 * @param delta - Frame delta time.
 * @param halflife - The half-life of decay (smoothing)
 * @returns If smoothing number, returns the smoothed number. If smoothing Vector, returns void.
 */
export declare function lerpSmooth(start: number, end: number, delta: number, halflife: number): number;
export declare function lerpSmooth(start: VectorLike, end: VectorLike, delta: number, halflife: number): void;
