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
import { GLTFAsset } from "../../src/Assets/GLTFAsset.ts";
import { SkyActor, SkyDirectionalLightTag } from "../../src/Actors/SkyActor.ts";
import { RigidBodyBehavior } from "../../src/Physics/RigidBody.ts";
import Rapier from "@dimforge/rapier3d-compat";
import { ColliderBehavior, Colliders } from "../../src/Physics/ColliderBehavior.ts";
import { Behavior } from "../../src/Scene/Behavior.ts";
import { MouseCode } from "../../src/Input/MouseCode.ts";
import { PhysicsController } from "../../src/Physics/PhysicsController.ts";
import { defineComponent, ElysiaElement } from "../../src/UI/UI.ts";
import { css, html } from "../../src/UI/UI.ts";
import { KeyCode } from "../../src/Input/KeyCode.ts";
import { Actor } from "../../src/Scene/Actor.ts";

const app = new Application({
	renderPipeline: new HighDefRenderPipeline(

	),
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
		console.log(col.colliderDescription)
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
			createCube(i, j, k, 1)
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

class CrossHairUI extends ElysiaElement
{
	static override Tag = "cross-hair-ui";

	static styles = css`
		:host {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 100;
		}
		
		.crosshair.left {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 10px;
			height: 2px;
			background-color: white;
		}
		
		.crosshair.right {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 10px;
			height: 2px;
			background-color: white;
		}
		
		.crosshair.top {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 2px;
			height: 10px;
			background-color: white;
		}
		
		.crosshair.bottom {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 2px;
			height: 10px;
			background-color: white;
	`

	render()
	{
		return html`
			<div class="crosshair left"></div>
			<div class="crosshair right"></div>
			<div class="crosshair top"></div>
			<div class="crosshair bottom"></div>`
	}
}

defineComponent(CrossHairUI)

document.body.appendChild(document.createElement("cross-hair-ui"))

// scene.addComponent(new Player)

const p = new Actor;
p.position.y = 3;
p.rotation.y = Math.PI / 2
p.rotation.x = Math.PI / 3


const rb = new Actor;
rb.addComponent(new RigidBodyBehavior({ type: Rapier.RigidBodyType.Dynamic }))
rb.scale.setScalar(.3)
p.addComponent(rb)

const t = new CubeActor;
const cube = new ColliderBehavior({ type: Colliders.Box({ x: 1, y: 1, z: 1 }) });
t.addComponent(cube);
t.position.x = 1;

const s = new SphereActor;
const sphereCollider = new ColliderBehavior({ type: Colliders.Sphere(1) });
s.addComponent(sphereCollider);
s.position.x = -1;

rb.addComponent(t)
rb.addComponent(s)

// scene.addComponent(p)

app.loadScene(scene);
