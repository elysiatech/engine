export function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
export function remap(value, fromMin, fromMax, toMin, toMax) {
    return toMin + (value - fromMin) * (toMax - toMin) / (fromMax - fromMin);
}
/**
 * Linearly interpolates between two numbers.
 */
export function lerp(a, b, t) { return a + (b - a) * t; }
/**
 * Linearly interpolates between two vectors.
 */
export function slerp(a, b, t) {
    return a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;
}
