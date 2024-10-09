import * as Three from "three";
import { Application } from "../src/Core/ApplicationEntry.ts";
import { Scene } from "../src/Scene/Scene.ts";
import { BasicRenderPipeline } from "../src/RPipeline/BasicRenderPipeline.ts";
import { CubeActor } from "../src/Actors/Primitives.ts";
import { PerspectiveCameraActor } from "../src/Actors/PerspectiveCameraActor.ts";
import { CameraOrbitBehavior } from "../src/Behaviors/CameraOrbitBehavior.ts";
import { DirectionalLightActor } from "../src/Actors/DirectionalLightActor.ts";
import { EnvironmentActor } from "../src/Actors/EnvironmentActor.ts";

// Create the application.
const app = new Application({
	renderPipeline: new BasicRenderPipeline,
	stats: true,
});

// Create a scene
const scene = new Scene;

const floor = new CubeActor;
floor.position.y = -1;
floor.scale.x = 10;
floor.scale.z = 10;
scene.addComponent(floor)

const cube = new CubeActor;
cube.material.color = new Three.Color('#ee95ff')
scene.addComponent(cube)

const camera = new PerspectiveCameraActor;
camera.position.set(-2, 2, 5);
camera.addComponent(new CameraOrbitBehavior);
// set the camera as the active camera
scene.activeCamera = camera;
scene.addComponent(camera);

const light = new DirectionalLightActor;
light.position.set(10, 10, 10);
light.intensity = 1;
scene.addComponent(light);

// Create an actor that holds the environment map / scene
const env = new EnvironmentActor;
env.background = true;
env.backgroundBlur = 4;
scene.addComponent(env);

// enable the scene grid in dev mode
import.meta.DEV && scene.grid.enable()

// set the default ambient light intensity
scene.ambientLight.intensity = 0.1;

// Load the scene
await app.loadScene(scene);

console.log("Hello, Cube!");