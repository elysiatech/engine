import { Application } from "../../../src/Core/Application";
import { Scene } from "../../../src/Scene/Scene";
import { ActiveCameraTag } from "../../../src/Core/Tags.ts";
import { CameraOrbitBehavior } from "../../../src/Behaviors/CameraOrbitBehavior.ts";
import { PerspectiveCameraActor } from "../../../src/Actors/PerspectiveCameraActor.ts";
import { DirectionalLightActor } from "../../../src/Actors/DirectionalLightActor.ts";
import { AmbientLightActor } from "../../../src/Actors/AmbientLightActor.ts";
import { CubeActor, PlaneActor } from "../../../src/Actors/Primitives.ts";
import { HighDefRenderPipeline } from "../../../src/RPipeline/HighDefRenderPipeline.ts";
import * as Three from "three";
import { RapierPhysicsController } from "../../../src/RapierPhysics/PhysicsController.ts";
import { ELYSIA_LOGGER } from "../../../old/Core/Logger.ts";
import { KeyCode } from "../../../src/Input/KeyCode.ts";
import { ElysiaEvent } from "../../../src/Events/Event.ts";
import { GLTFAsset } from "../../../src/Assets/GLTFAsset.ts";
import { ModelActor } from "../../../src/Actors/ModelActor.ts";
import { EnvironmentActor } from "../../../src/Actors/EnvironmentActor.ts";
import { SkyActor, SkyDirectionalLightTag } from "../../../src/Actors/SkyActor.ts";
import { BasicRenderPipeline } from "../../../src/RPipeline/BasicRenderPipeline.ts";
import { GridActor } from "../../../src/Actors/GridActor.ts";

const app = new Application({
	renderPipeline: new HighDefRenderPipeline({
		ssao: {
			intensity: 1.5,
		},
	}),
	stats: true,
});

class MyScene extends Scene
{

	physics = new RapierPhysicsController({ gravity: new Three.Vector3(0, -9.81, 0), debug: true });

	override async onLoad()
	{
		await super.onLoad();
		await this.physics.init(this);
	}

	override onStart()
	{
		this.physics.start();
	}

	override onUpdate(d: number)
	{
		this.physics.updatePhysicsWorld(this, d)
	}
}

const scene = new MyScene();

const cameraActor = new PerspectiveCameraActor()
cameraActor.position.z = 5;
cameraActor.addTag(ActiveCameraTag);
const orbitBehavior = new CameraOrbitBehavior();
cameraActor.addComponent(orbitBehavior);
scene.addComponent(cameraActor);

const meshAsset = new GLTFAsset("/testgltf.glb")

await meshAsset.load();

const cube = new CubeActor;
scene.addComponent(cube);

const floor = new PlaneActor()
floor.scale.set(10, 10, 10);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -.5;
scene.addComponent(floor);

const dirLight = new DirectionalLightActor()
scene.addComponent(dirLight);
dirLight.addTag(SkyDirectionalLightTag)

const ambLight = new AmbientLightActor()
scene.addComponent(ambLight);

const sky = new SkyActor
sky.elevation = 2;
sky.rayleigh = 1
sky.turbidity = 10
sky.mieDirectionalG = 0.8
scene.addComponent(sky)

const grid = new GridActor;

scene.addComponent(grid);

app.loadScene(scene);
