import { Application } from "../../../src/Core/Application";
import { Scene } from "../../../src/Scene/Scene";
import { Actor } from "../../../src/Scene/Actor";
import * as Three from "three";
import { ActiveCameraTag } from "../../../src/Core/Tags.ts";
import { Behavior } from "../../../src/Scene/Behavior.ts";
import { BasicRenderPipeline } from "../../../src/RPipeline/BasicRenderPipeline.ts";

const app = new Application({
	renderPipeline: new BasicRenderPipeline({
		alpha: true,
	})
});

const scene = new Scene();

const cameraActor = new Actor();
cameraActor.object3d = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraActor.object3d.position.z = 5;
cameraActor.addTag(ActiveCameraTag);
scene.addComponent(cameraActor);

class SpinBehavior extends Behavior
{
	onUpdate(delta: number)
	{
		this.parent!.object3d.rotation.x += delta;
		this.parent!.object3d.rotation.y += delta;
	}
}


const cube = new Actor();
cube.object3d = new Three.Mesh(
	new Three.BoxGeometry(),
	new Three.MeshBasicMaterial({ color: 0x00ff00 }),
);
cube.addComponent(new SpinBehavior());
scene.addComponent(cube)

app.loadScene(scene);
