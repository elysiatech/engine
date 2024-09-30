import { Application } from "../../src/Core/Application";
import { Scene } from "../../src/Scene/Scene";
import { ActiveCameraTag } from "../../src/Core/Tags.ts";
import { CameraOrbitBehavior } from "../../src/Behaviors/CameraOrbitBehavior.ts";
import { PerspectiveCameraActor } from "../../src/Actors/PerspectiveCameraActor.ts";
import { DirectionalLightActor } from "../../src/Actors/DirectionalLightActor.ts";
import { AmbientLightActor } from "../../src/Actors/AmbientLightActor.ts";
import { CubeActor, PlaneActor } from "../../src/Actors/Primitives.ts";
import { HighDefRenderPipeline } from "../../src/RPipeline/HighDefRenderPipeline.ts";
import * as Three from "three";
import { PhysicsController } from "../../src/Physics/PhysicsController.ts";
import { GLTFAsset } from "../../src/Assets/GLTFAsset.ts";
import { SkyActor, SkyDirectionalLightTag } from "../../src/Actors/SkyActor.ts";
import { BasicRenderPipeline } from "../../src/RPipeline/BasicRenderPipeline.ts";

const app = new Application({
	renderPipeline: new HighDefRenderPipeline({
		ssao: {
			intensity: 1.5,
		},
	}),
	stats: true,
});

// const app = new Application({
// 	renderPipeline: new BasicRenderPipeline({
// 		antialias: true,
// 	}),
// 	stats: true,
// })

class MyScene extends Scene
{

	physics = new PhysicsController({ gravity: new Three.Vector3(0, -9.81, 0), debug: true });

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
cameraActor.position.y = 2;
cameraActor.addTag(ActiveCameraTag);
const orbitBehavior = new CameraOrbitBehavior();
cameraActor.addComponent(orbitBehavior);
scene.addComponent(cameraActor);

const meshAsset = new GLTFAsset("/testgltf.glb")

await meshAsset.load();

const cube = new CubeActor;
cube.position.y = .5;
(cube.material as Three.MeshStandardMaterial).color = new Three.Color("#ee95ff");
scene.addComponent(cube);

const floor = new PlaneActor()
floor.scale.set(10, 10, 10);
floor.position.y = -0.01;
floor.rotation.x = -Math.PI / 2;
scene.addComponent(floor);

const dirLight = new DirectionalLightActor()
scene.addComponent(dirLight);
dirLight.addTag(SkyDirectionalLightTag)

const ambLight = new AmbientLightActor()
scene.addComponent(ambLight);

const sky = new SkyActor
sky.elevation = 40;
sky.azimuth = 38
scene.addComponent(sky)

scene.grid.enable();

app.loadScene(scene);
