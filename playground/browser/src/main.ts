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


const app = new Application({
	renderPipeline: new HighDefRenderPipeline({
		ssao:{
			intensity: 2,
		},
		bloom: true,
		chromaticAberration: true,
	})
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

// const meshLoader = new GLTFLoader;
// const meshAsset = await meshLoader.loadAsync("/testgltf.glb");
// const mesh = new ModelActor(meshAsset);
// scene.addComponent(mesh);

const cube = new CubeActor;
scene.addComponent(cube);

const floor = new PlaneActor()
floor.scale.set(10, 10, 10);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -.5;
scene.addComponent(floor);

const dirLight = new DirectionalLightActor()
dirLight.position.set(6, 10, 3);
dirLight.debug = true;
scene.addComponent(dirLight);

const ambLight = new AmbientLightActor()
scene.addComponent(ambLight);

app.loadScene(scene);
