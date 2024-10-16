import * as Three from "three"
import * as Actors from "../../src/Actors/mod.ts"
import { Scene } from "../../src/Scene/Scene.ts";
import { PhysicsController } from "../../src/Physics/PhysicsController.ts";
import { Colors } from "../../src/Core/Colors.ts";
import { ColliderBehavior, Colliders } from "../../src/Physics/ColliderBehavior.ts";
import { FiniteStateMachine } from "../../src/Core/FiniteStateMachine.ts"
import { Actor } from "../../src/Scene/Actor.ts";
import { Assets } from "./Assets.ts";

import "../../src/UI/ElysiaCrossHair.ts";

function getPositionAtDepth(camera: Three.PerspectiveCamera, depth: number, x: number, y: number) {
	const nearPlanePoint = new Three.Vector3(x, y, -1).unproject(camera);
	const farPlanePoint = new Three.Vector3(x, y, 1).unproject(camera);
	const direction = farPlanePoint.sub(nearPlanePoint).normalize();
	const distanceFromNearPlane = depth - camera.near;
	const scaledDirection = direction.multiplyScalar(distanceFromNearPlane);
	return nearPlanePoint.add(scaledDirection);
}

function setLocalObjectPositionViaWorldSpace(
	object: Three.Object3D,
	position: Three.Vector3,
) {
	const parent = object.parent;
	if (parent) {
		const inverseParentMatrix = new Three.Matrix4().copy(parent.matrixWorld).invert();
		object.position.copy(position.applyMatrix4(inverseParentMatrix));
	} else {
		object.position.copy(position);
	}
}

function toNormalizedDeviceCoordinates(x: number, y: number, width: number, height: number)
{
	return [
		( x / width ) * 2 - 1,
		- ( y / height ) * 2 + 1
	]
}

class FirstPersonWeaponRig extends Actor
{
	modelRoot!: Actors.ModelActor;

	onCreate()
	{
		const magnum = Assets.unwrap("Magnum").gltf;

		this.modelRoot = new Actors.ModelActor(magnum);

		this.modelRoot.rotation.y = Math.PI / 1;
		this.modelRoot.position.z = .5
		this.modelRoot.position.y = .8;

		this.addComponent(this.modelRoot);

		this.modelRoot.getAction("06 Walk")?.setEffectiveTimeScale(.3).play();
	}

	createStateMachine(): FiniteStateMachine
	{
		const fsm = new FiniteStateMachine()

		return fsm;
	}
}

export class TestScene extends Scene
{
	environment = new Actors.EnvironmentActor;

	player = new Actors.Player;

	guns = new FirstPersonWeaponRig;

	floor = new Actors.CubeActor(Colors.Cullen, new Three.Vector3(0, -.51, 0), undefined, new Three.Vector3(100, 1, 100));

	physics = new PhysicsController({
		debug: false,
	});

	crosshair = document.createElement("elysia-crosshair");

	onCreate()
	{
		this.grid.enable();

		this.addComponent(this.floor);
		this.floor.addComponent(new ColliderBehavior({ type: Colliders.Box({ x:100, y:1, z:100 }) }))

		this.player.position.set(0, 4, 0);
		this.player.rotationRoot.addComponent(this.guns);
		this.activeCamera = this.player.camera;
		this.addComponent(this.player);

		this.environment.background = true;
		this.environment.backgroundBlur = 3;
		this.addComponent(this.environment);

		document.body.append(this.crosshair);
	}

	onDestroy()
	{
		this.crosshair.remove();
	}
}
