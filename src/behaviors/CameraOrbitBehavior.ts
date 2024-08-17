import { OrbitControls } from "three-stdlib";
import { PerspectiveCameraActor } from "../actors/PerspectiveCameraActor";
import { Behavior } from "../behavior";

export class CameraOrbitBehavior extends Behavior {
	controls: OrbitControls | null = null;

	onCreate() {
		super.onCreate();

		if (!(this.parent instanceof PerspectiveCameraActor)) return;

		const renderer = this.scene!.game!.renderPipeline.getRenderer();

		this.controls = new OrbitControls(
			this.parent.object3d,
			renderer.domElement,
		);
	}

	onUpdate(frametime: number, elapsedtime: number) {
		super.onUpdate(frametime, elapsedtime);

		this.controls!.update();
	}
}
