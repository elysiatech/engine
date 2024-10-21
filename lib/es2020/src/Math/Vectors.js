import { hasKeys, isObject } from "../Core/Asserts.js";
export function isVectorLike(obj) { return isObject(obj); }
export function isVector2Like(obj) { return hasKeys(obj, "x", "y"); }
export function isVector3Like(obj) { return hasKeys(obj, "x", "y", "z"); }
export function isVector4Like(obj) { return hasKeys(obj, "x", "y", "z", "w"); }
