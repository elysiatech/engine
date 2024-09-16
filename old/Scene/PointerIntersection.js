import * as Three from "three";
export class PointerIntersections {
    intersections = new Set();
    cast(pointer, camera, scene) {
        this.raycaster.setFromCamera(pointer, camera);
        for (const i of this.raycaster.intersectObjects(scene.object3d.children)) {
            if (i.object.userData.owner)
                this.intersections.add(i.object.userData.owner);
        }
    }
    raycaster = new Three.Raycaster();
}
