import { Application } from "../../src/Core/Application";
import { Scene } from "../../src/Scene/Scene";
import { ActiveCameraTag } from "../../src/Core/Tags.ts";
import { CameraOrbitBehavior } from "../../src/Behaviors/CameraOrbitBehavior.ts";
import { PerspectiveCameraActor } from "../../src/Actors/PerspectiveCameraActor.ts";
import { DirectionalLightActor } from "../../src/Actors/DirectionalLightActor.ts";
import { AmbientLightActor } from "../../src/Actors/AmbientLightActor.ts";
import { CubeActor, PlaneActor, SphereActor } from "../../src/Actors/Primitives.ts";
import { HighDefRenderPipeline } from "../../src/RPipeline/HighDefRenderPipeline.ts";
import * as Three from "three";
import { GLTFAsset } from "../../src/Assets/GLTFAsset.ts";
import { SkyActor, SkyDirectionalLightTag } from "../../src/Actors/SkyActor.ts";
import { RigidBodyBehavior } from "../../src/Physics/RigidBody.ts";
import Rapier from "@dimforge/rapier3d-compat";
import { ColliderBehavior, Colliders } from "../../src/Physics/ColliderBehavior.ts";
import { Behavior } from "../../src/Scene/Behavior.ts";
import { MouseCode } from "../../src/Input/MouseCode.ts";
import { PhysicsController } from "../../src/Physics/PhysicsController.ts";

const app = new Application({
	renderPipeline: new HighDefRenderPipeline({
		ssao: {
			intensity: 1.5,
		},
	}),
	stats: true,
});

class ProjectileBehavior extends Behavior
{
	onCreate() {
		this.app!.input!.onKeyDown(MouseCode.MouseLeft, () => this.shoot())
	}

	private shoot()
	{
		console.log("shooting")
		if(!this.parent || !this.scene) return;
		const actor = new SphereActor;
		actor.position.copy(this.parent!.position);
		actor.scale.setScalar(.1);
		// (actor.material as Three.MeshStandardMaterial).color = new Three.Color("red")
		const rb = new RigidBodyBehavior({ type: Rapier.RigidBodyType.Dynamic })
		actor.addComponent(rb)
		rb.addForce(new Three.Vector3(0, 0, -10))
		actor.addComponent(new ColliderBehavior({ type: Colliders.Sphere(.1) }))
		this.scene.addComponent(actor)
	}
}

const scene = new Scene();
scene.physics = new PhysicsController({ gravity: new Three.Vector3(0, -9.81, 0) });

const cameraActor = new PerspectiveCameraActor()
cameraActor.position.z = 5;
cameraActor.position.y = 2;
cameraActor.addTag(ActiveCameraTag);
const orbitBehavior = new CameraOrbitBehavior();
cameraActor.addComponent(orbitBehavior);
cameraActor.addComponent(new ProjectileBehavior)
scene.addComponent(cameraActor);

const meshAsset = new GLTFAsset("/testgltf.glb")

await meshAsset.load();

const createCube = (x: number, y: number, z: number) =>
{
	const cube = new CubeActor;
	cube.position.set(x + .1, y + .1, z + .1);
	(cube.material as Three.MeshStandardMaterial).color = new Three.Color("#ee95ff");
	scene.addComponent(cube);
	const rb = new RigidBodyBehavior({ type: Rapier.RigidBodyType.Dynamic })
	const boxCol = new ColliderBehavior({type: Colliders.Box({ x: 1, y: 1, z: 1 })})
	cube.addComponent(rb)
	cube.addComponent(boxCol)
}

for(let i = 0; i < 5; i++)
{
	for(let j = 0; j < 5; j++)
	{
		for(let k = 0; k < 5; k++)
		{
			createCube(i, j, k)
		}
	}
}

const floor = new PlaneActor()
floor.scale.set(50, 50, 50);
floor.position.y = -0.01;
floor.rotation.x = -Math.PI / 2;
floor.addComponent(new ColliderBehavior({ type: Colliders.Box({ x: 50, y: 0.01, z: 50 }) }))
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
