import { lerp } from "./Other.js";
export function lerpSmooth(start, end, delta, halflife) {
    if (typeof start === 'number') {
        // @ts-ignore
        return lerp(start, end, -Math.expm1(-(0.69314718056 * delta) / (halflife + 1e-5)));
    }
    else {
        if (start.x) {
            // @ts-ignore
            start.x = lerp(start.x, end.x, -Math.expm1(-(0.69314718056 * delta) / (halflife + 1e-5)));
        }
        if (start.y) {
            // @ts-ignore
            start.y = lerp(start.y, end.y, -Math.expm1(-(0.69314718056 * delta) / (halflife + 1e-5)));
        }
        if (start.z) {
            // @ts-ignore
            start.z = lerp(start.z, end.z, -Math.expm1(-(0.69314718056 * delta) / (halflife + 1e-5)));
        }
        if (start.w) { // @ts-ignore
            start.w = lerp(start.w, end.w, -Math.expm1(-(0.69314718056 * delta) / (halflife + 1e-5)));
        }
    }
}
