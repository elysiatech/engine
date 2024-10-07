import { Application } from "../../src/Core/ApplicationEntry.ts";
import { Scene } from "../../src/Scene/Scene";
import { ActiveCameraTag } from "../../src/Core/Tags.ts";
import { CameraOrbitBehavior } from "../../src/Behaviors/CameraOrbitBehavior.ts";
import { PerspectiveCameraActor } from "../../src/Actors/PerspectiveCameraActor.ts";
import { DirectionalLightActor } from "../../src/Actors/DirectionalLightActor.ts";
import { AmbientLightActor } from "../../src/Actors/AmbientLightActor.ts";
import { CubeActor, PlaneActor, SphereActor } from "../../src/Actors/Primitives.ts";
import { HighDefRenderPipeline } from "../../src/RPipeline/HighDefRenderPipeline.ts";
import * as Three from "three";
import { SkyActor, SkyDirectionalLightTag } from "../../src/Actors/SkyActor.ts";
import { RigidBodyBehavior } from "../../src/Physics/RigidBody.ts";
import Rapier from "@dimforge/rapier3d-compat";
import { ColliderBehavior, Colliders } from "../../src/Physics/ColliderBehavior.ts";
import { Behavior } from "../../src/Scene/Behavior.ts";
import { PhysicsController } from "../../src/Physics/PhysicsController.ts";
import { KeyCode } from "../../src/Input/KeyCode.ts";
import "../../src/UI/ElysiaCrossHair.ts"
import { Player } from "./Player.ts";

const app = new Application({
	renderPipeline: new HighDefRenderPipeline({
		ssao: {
			intensity: 1.5,
			aoRadius: 0.5,
		}
	}),
	stats: true,
});

class KillIfOutOfBounds extends Behavior
{
	onUpdate()
	{
		if(!this.parent) return;
		if(this.parent.position.y < -10)
		{
			this.parent.destructor();
		}
	}
}

class ProjectileBehavior extends Behavior
{
	onCreate() {
		this.app!.input!.onKeyDown(KeyCode.Space, () => this.shoot())
	}

	private shoot()
	{
		if(!this.parent || !this.scene) return;

		const actor = new SphereActor;
		actor.position.copy(this.parent!.position);
		actor.material.color = new Three.Color("red")
		actor.scale.setScalar(.1);

		const rb = new RigidBodyBehavior({ type: Rapier.RigidBodyType.Dynamic })
		const cameraVector = new Three.Vector3(0, 0, -1).applyQuaternion(this.parent!.quaternion);
		const col = new ColliderBehavior({ type: Colliders.Sphere(.1), density: 100, mass: 10 })
		rb.setLinearVelocity(cameraVector.multiplyScalar(100))
		rb.enableContinuousCollisionDetection(true)

		actor.addComponent(rb)
		actor.addComponent(col)
		actor.addComponent(new KillIfOutOfBounds)

		this.scene.addComponent(actor)
	}
}

const scene = new Scene();
scene.physics = new PhysicsController({ gravity: new Three.Vector3(0, -9.81, 0), debug: true });

const cameraActor = new PerspectiveCameraActor()
cameraActor.position.z = 5;
cameraActor.position.y = 2;
cameraActor.addTag(ActiveCameraTag);
const orbitBehavior = new CameraOrbitBehavior();
cameraActor.addComponent(orbitBehavior);
cameraActor.addComponent(new ProjectileBehavior)
scene.addComponent(cameraActor);

const createCube = (x: number, y: number, z: number, i: number) =>
{
	const cube = new CubeActor;
	cube.position.set(x + .1*i, y + .1*i, z + .1*i);
	(cube.material as Three.MeshStandardMaterial).color = new Three.Color("#ee95ff");
	const rb = new RigidBodyBehavior({ type: Rapier.RigidBodyType.Dynamic })
	const boxCol = new ColliderBehavior({ type: Colliders.Box({ x: 1, y: 1, z: 1 }) })
	cube.addComponent(new KillIfOutOfBounds);
	cube.addComponent(rb);
	cube.addComponent(boxCol);
	scene.addComponent(cube);
}

for(let i = 0; i < 5; i++)
{
	for(let j = 0; j < 5; j++)
	{
		for(let k = 0; k < 5; k++)
		{
			// createCube(i, j, k, 1)
		}
	}
}

const floor = new PlaneActor()
floor.scale.set(50, 50, 1);
floor.position.y = -0.01;
floor.rotation.x = -Math.PI / 2;
floor.addComponent(new ColliderBehavior({ type: Colliders.Box({ x: 50, y: 50, z: 0.01 }) }))
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


document.body.appendChild(document.createElement("elysia-crosshair"))

scene.addComponent(new Player)


app.loadScene(scene);
