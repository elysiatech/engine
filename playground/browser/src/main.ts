import { Application } from "../../../src/Core/Application";
import { Scene } from "../../../src/Scene/Scene";
import { ActiveCameraTag } from "../../../src/Core/Tags.ts";
import { CameraOrbitBehavior } from "../../../src/Behaviors/CameraOrbitBehavior.ts";
import { PerspectiveCameraActor } from "../../../src/Actors/PerspectiveCameraActor.ts";
import { DirectionalLightActor } from "../../../src/Actors/DirectionalLightActor.ts";
import { AmbientLightActor } from "../../../src/Actors/AmbientLightActor.ts";
import { PlaneActor } from "../../../src/Actors/Primitives.ts";
import { HighDefRenderPipeline } from "../../../src/RPipeline/HighDefRenderPipeline.ts";
import { GLTFLoader } from "three-stdlib";
import * as Three from "three";
import { Actor } from "../../../src/Scene/Actor.ts";
import { ModelActor } from "../../../src/Actors/ModelActor.ts";

const app = new Application({
	renderPipeline: new HighDefRenderPipeline({
		ssao: true,
	})
});

const scene = new Scene();

const cameraActor = new PerspectiveCameraActor()
cameraActor.position.z = 5;
cameraActor.addTag(ActiveCameraTag);
const orbitBehavior = new CameraOrbitBehavior();
cameraActor.addComponent(orbitBehavior);
scene.addComponent(cameraActor);

const meshLoader = new GLTFLoader;

const meshAsset = await meshLoader.loadAsync("/testgltf.glb");

const mesh = new ModelActor(meshAsset);

scene.addComponent(mesh);

const floor = new PlaneActor()
floor.position.y = -0.5;
floor.scale.set(10, 10, 10);
floor.rotation.x = -Math.PI / 2;
scene.addComponent(floor);

const dirLight = new DirectionalLightActor()
dirLight.position.set(6, 10, 3);
dirLight.debug = true;
scene.addComponent(dirLight);

const ambLight = new AmbientLightActor()
scene.addComponent(ambLight);

app.loadScene(scene);
