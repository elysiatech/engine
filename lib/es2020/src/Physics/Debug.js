import * as Three from "three";
export class PhysicsDebugRenderer {
    constructor(enabled = true) {
        Object.defineProperty(this, "enabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: enabled
        });
        Object.defineProperty(this, "mesh", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "world", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    start(scene, world) {
        this.world = world;
        this.mesh = new Three.LineSegments(new Three.BufferGeometry(), new Three.LineBasicMaterial({ color: 0xffffff, vertexColors: true }));
        this.mesh.frustumCulled = false;
        scene.add(this.mesh);
    }
    update() {
        if (this.enabled) {
            if (!this.world)
                return;
            const { vertices, colors } = this.world.debugRender();
            this.mesh.geometry.setAttribute('position', new Three.BufferAttribute(vertices, 3));
            this.mesh.geometry.setAttribute('color', new Three.BufferAttribute(colors, 4));
            this.mesh.visible = true;
        }
        else {
            this.mesh.visible = false;
        }
    }
}
