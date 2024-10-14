export declare function clamp(value: number, min: number, max: number): number;
export declare function remap(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number;
/**
 * Linearly interpolates between two numbers.
 */
export declare function lerp(a: number, b: number, t: number): number;
/**
 * Linearly interpolates between two vectors.
 */
export declare function slerp(a: number, b: number, t: number): number;
