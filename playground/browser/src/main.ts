import { Application } from "../../../src/Core/Application";
import { Scene } from "../../../src/Scene/Scene";
import { ActiveCameraTag } from "../../../src/Core/Tags.ts";
import { Behavior } from "../../../src/Scene/Behavior.ts";
import { BasicRenderPipeline } from "../../../src/RPipeline/BasicRenderPipeline.ts";
import { CameraOrbitBehavior } from "../../../src/Behaviors/CameraOrbitBehavior.ts";
import { PerspectiveCameraActor } from "../../../src/Actors/PerspectiveCameraActor.ts";
import { DirectionalLightActor } from "../../../src/Actors/DirectionalLightActor.ts";
import { AmbientLightActor } from "../../../src/Actors/AmbientLightActor.ts";
import { CubeActor } from "../../../src/Actors/Primitives.ts";

const app = new Application({
	renderPipeline: new BasicRenderPipeline({
		alpha: true,
	})
});

const scene = new Scene();

const cameraActor = new PerspectiveCameraActor()
cameraActor.position.z = 5;
cameraActor.addTag(ActiveCameraTag);
const orbitBehavior = new CameraOrbitBehavior();
cameraActor.addComponent(orbitBehavior);
scene.addComponent(cameraActor);

class SpinBehavior extends Behavior
{
	onUpdate(delta: number)
	{
		this.parent!.object3d.rotation.x += delta;
		this.parent!.object3d.rotation.y += delta;
	}
}

const cube = new CubeActor()
cube.addComponent(new SpinBehavior());
scene.addComponent(cube);

const dirLight = new DirectionalLightActor()
dirLight.position.set(0, 10, 0);
dirLight.target = cube.object3d;
scene.addComponent(dirLight);

const ambLight = new AmbientLightActor()
scene.addComponent(ambLight);

app.loadScene(scene);
