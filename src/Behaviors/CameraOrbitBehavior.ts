import { OrbitControls } from "three-stdlib";
import { Behavior } from "../Scene/Behavior";
import { ELYSIA_LOGGER } from "../Core/Logger";
import { isOrthographicCamera, isPerspectiveCamera } from "../Core/Asserts";
import { PerspectiveCameraActor } from "../Actors/PerspectiveCameraActor.ts";
import { OrthographicCameraActor } from "../Actors/OrthographicCameraActor.ts";

/**
 * Implements the standard orbit controls for a camera.
 */
export class CameraOrbitBehavior extends Behavior
{

	override type = 'CameraOrbitBehavior';

	controls?: OrbitControls;

	/**
	 * Whether the camera should be damped smooth or not.
	 * @default false
	 */
	get smooth() { return this.controls?.enableDamping ?? false; }
	set smooth(value: boolean)
	{
		if(this.controls) this.controls.enableDamping = value;

		this.#smooth = value;
	}

	onCreate()
	{
		super.onCreate();

		const camera = this.parent?.getComponentsByType(PerspectiveCameraActor).first ?? this.parent?.getComponentsByType(OrthographicCameraActor).first;

		if(!camera)
		{
			ELYSIA_LOGGER.error("No camera found to attach orbit controls to", this.parent);
			return
		}

		if(!isPerspectiveCamera(camera) && !isOrthographicCamera(camera))
		{
			ELYSIA_LOGGER.error("Camera is not a Perspective or Orthographic camera", camera);
			return
		}

		this.controls = new OrbitControls(camera, this.app!.renderPipeline.getRenderer().domElement);

		this.controls.enableDamping = this.#smooth;
	}

	onUpdate()
	{
		if(this.controls)
		{
			this.controls.update();
		}
	}

	#smooth = false;
}