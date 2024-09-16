import { Behavior } from "../Scene/Behavior";
export class SpinBehavior extends Behavior {
    x;
    y;
    z;
    constructor(args = {}) {
        super();
        this.x = args.x ?? 1;
        this.y = args.y ?? 1;
        this.z = args.z ?? 1;
    }
    onUpdate(frametime, elapsedtime) {
        super.onUpdate(frametime, elapsedtime);
        if (!this.parent)
            return;
        this.parent.rotation.x += 0.5 * this.x * frametime;
        this.parent.rotation.y += 0.5 * this.y * frametime;
        this.parent.rotation.z += 0.5 * this.z * frametime;
        this.parent.object3d.updateMatrix();
    }
}
