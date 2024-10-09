import { Application } from "../../src/Core/ApplicationEntry.ts";
import { Scene } from "../../src/Scene/Scene";
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
import "../../src/UI/ElysiaCrossHair.ts"
import { Player } from "./Player.ts";
import { MouseCode } from "../../src/Input/MouseCode.ts";

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
		this.app!.input!.onKeyDown(MouseCode.MouseLeft, () => this.shoot())
	}

	private shoot()
	{
		if(!this.parent || !this.scene) return;

		const camera = this.scene.getActiveCamera();
		if (!camera) return;

		const actor = new SphereActor;
		actor.position.copy(camera.getWorldPosition(new Three.Vector3))
		actor.position.add(camera.getWorldDirection(new Three.Vector3).multiplyScalar(2));
		actor.material.color = new Three.Color("red");
		actor.scale.setScalar(0.1);

		// Calculate the forward vector of the camera using its world matrix
		const cameraForward = new Three.Vector3;
		camera.getWorldDirection(cameraForward);

		// Ensure the forward vector is normalized (although getWorldDirection should return a normalized vector)
		cameraForward.normalize();

		const rb = new RigidBodyBehavior({ type: Rapier.RigidBodyType.Dynamic });
		const col = new ColliderBehavior({ type: Colliders.Sphere(0.1), density: 10, mass: 1 });

		// Apply velocity in the camera's forward direction
		rb.enableContinuousCollisionDetection(true);

		// rb.applyImpulse(cameraForward.multiplyScalar(20))
		setTimeout(() => rb.applyImpulse(cameraForward.multiplyScalar(2)), 1);

		actor.addComponent(rb);
		actor.addComponent(col);
		actor.addComponent(new KillIfOutOfBounds);

		this.scene.addComponent(actor);
	}
}

const scene = new Scene();

scene.physics = new PhysicsController({ gravity: new Three.Vector3(0, -9.81, 0), debug: false });

const randomColor = () => {
	return new Three.Color(Math.random(), Math.random(), Math.random());
}

const createCube = (x: number, y: number, z: number, color: string) =>
{
	const i = 1;
	const cube = new CubeActor;
	cube.position.set(x + .1*i, y + .1*i, z + .1*i);
	(cube.material as Three.MeshStandardMaterial).color = new Three.Color(color);
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
			createCube(i, j, k, randomColor())
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
scene.addComponent(sky)

scene.grid.enable();

document.body.appendChild(document.createElement("elysia-crosshair"))

const p = new Player;
p.position.set(10, 2, 10)
p.addComponent(new ProjectileBehavior)
scene.addComponent(p)

app.loadScene(scene);
