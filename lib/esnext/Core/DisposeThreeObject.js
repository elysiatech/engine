import { isObject3D, isRenderItem } from "./Asserts.js";
/****************************************************************************************
 * Adopted from Lume, thank you <3
 * https://github.com/lume/lume/blob/a16fc59473e11ac53e7fa67e1d3cb7e060fe1d72/src/utils/three.ts
 *****************************************************************************************/
/**
 * Dispose of a Three.js object, clearing resources.
 * @param obj
 */
function disposeObject(obj) {
    if (!obj)
        return;
    if (isRenderItem(obj)) {
        if (obj.geometry)
            obj.geometry.dispose();
        const materials = [].concat(obj.material);
        for (const material of materials) {
            material.dispose();
        }
    }
    Promise.resolve().then(() => {
        obj.parent && obj.parent.remove(obj);
    });
}
export function destroy(obj) {
    if (!isObject3D(obj))
        return;
    obj.traverse(disposeObject);
}
