import * as Three from "three";
import * as Elysia from "../src/mod.ts";
import { Actor } from "../src/Scene/Actor.ts";

// Create the application.
const app = new Elysia.Core.Application({
	renderPipeline: new Elysia.RPipeline.BasicRenderPipeline,
	stats: true,
});

// Create a s_Scene
const scene = new Elysia.Scene.Scene;

const floor = new Elysia.Actors.CubeActor;
floor.material.color = new Three.Color(Elysia.Core.Colors.VonCount);
floor.position.y = -1;
floor.scale.x = 10;
floor.scale.z = 10;
scene.addComponent(floor);

// const cube = new Elysia.Actors.CubeActor;
// cube.material.color = new Three.Color(Elysia.Core.Colors.Purple);
// s_Scene.addComponent(cube);
//
class TestActor extends Actor
{
	onCreate(): void
	{
		this.object3d = new Three.Mesh(
			new Three.BoxGeometry(1, 1, 1),
			new Three.MeshBasicMaterial({ color: Elysia.Core.Colors.Purple })
		);
	}
}

scene.addComponent(new TestActor)

const camera = new Elysia.Actors.PerspectiveCameraActor;
camera.position.set(-2, 5, 15);
camera.addComponent(new Elysia.Behaviors.CameraOrbitBehavior);
// set the camera as the active camera
scene.activeCamera = camera;
scene.addComponent(camera);

const light = new Elysia.Actors.DirectionalLightActor;
light.position.set(10, 10, 10);
light.intensity = 1;
scene.addComponent(light);

// Create an actor that holds the environment map / s_Scene
const env = new Elysia.Actors.EnvironmentActor;
env.background = true;
env.backgroundBlur = 4;
env.backgroundIntensity = .2;
scene.addComponent(env);

// enable the s_Scene grid in dev mode
ELYSIA_DEV && scene.grid.enable();

// set the default ambient light intensity
scene.ambientLight.intensity = 0.1;

// Load the s_Scene
await app.loadScene(scene);

console.log("Hello, Cube!");
