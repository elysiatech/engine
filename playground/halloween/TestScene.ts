import * as Three from "three"
import * as Actors from "../../src/Actors/mod.ts"
import { Scene } from "../../src/Scene/Scene.ts";
import { PhysicsController } from "../../src/Physics/PhysicsController.ts";
import { Colors } from "../../src/Core/Colors.ts";
import { ColliderBehavior, Colliders } from "../../src/Physics/ColliderBehavior.ts";
import { FiniteStateMachine, State, Transition } from "../../src/Core/FiniteStateMachine.ts"
import { Actor } from "../../src/Scene/Actor.ts";
import { Assets } from "./Assets.ts";
import { ModelActor } from "../../src/Actors/ModelActor.ts"
import { DirectionalLightActor } from "../../src/Actors/DirectionalLightActor.ts"
import  { KeyCode } from "../../src/Input/mod.ts"

import "../../src/UI/ElysiaCrossHair.ts";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

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
	guns: ModelActor[] = [];

	onCreate()
	{
		const magnum = new ModelActor(Assets.unwrap("Uzi").gltf);
		const shotgun = new ModelActor(Assets.unwrap("Shotgun").gltf);
		const uzi = new ModelActor(Assets.unwrap("Uzi").gltf);

		for(const gun of [magnum, uzi, shotgun])
		{
			this.guns.push(gun);
			gun.rotation.y = Math.PI / 1;
			gun.position.z = -0.05
			gun.position.y = 0.70;
			gun.getAction("04 Idle")?.play();
			gun.disable();
			this.addComponent(gun);
		}

		this.guns[0].enable()

		const fsm = this.createStateMachine()
	}

	createStateMachine(): FiniteStateMachine
	{
		const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms * 1000));

		const fsm = new FiniteStateMachine()

		interface Gun
		{
			state: FiniteStateMachine;
			magCapacity: number;
			ammo: number;
		}

		const magnum = new class implements Gun
		{
			magCapacity = 6;

			ammo = 6;

			state = new FiniteStateMachine({
				onEnter: () => {

				},
				onExit: () => {

				}
			})

			constructor()
			{
				this.state.addState("Equipping", {})
				this.state.addState("Idle", {})
				this.state.addState("Walking", {})
				this.state.addState("Shooting", {})
				this.state.addState("Reloading", {})
				this.state.addState("Stowing", {})
			}
		}

		const shotgun = new class implements Gun
		{
			magCapacity = 8;

			ammo = 8;

			state = new FiniteStateMachine({
				onEnter: () => {},
				onExit: () => {}
			})

			constructor()
			{
				this.state.addState("Equipping", { })
				this.state.addState("Idle", {})
				this.state.addState("Walking", {})
				this.state.addState("Shooting", {})
				this.state.addState("Reloading", {})
				this.state.addState("Stowing", {})

				this.state.addTransition({ from: "Idle", to: "Equipping", condition: () => {} })
			}
		}

		const uzi = new class implements Gun
		{
			magCapacity = 30;
			ammo = 30;
			state = new FiniteStateMachine({
				onEnter: () => {},
				onExit: () => {}
			})
		}

		fsm.addState("Magnum", magnum.state);
		fsm.addState("Shotgun", shotgun.state);
		fsm.addState("Uzi", uzi.state);

		this.app.input.onKeyDown(KeyCode.One, () => {
			fsm.fireEvent("SwapToMagnum")
		});

		this.app.input.onKeyDown(KeyCode.Two, () => {
			fsm.fireEvent("SwapToUzi")
		});

		this.app.input.onKeyDown(KeyCode.Three, () => {
			fsm.fireEvent("SwapToShotgun")
		});

		fsm.init();
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

		const dirLight = new DirectionalLightActor(2);
		dirLight.position.set(10, 30, 20);
		dirLight.debug = true;
		this.addComponent(dirLight);

		const dummy = new ModelActor(Assets.unwrap("Dummy").gltf)
		dummy.castShadow = true;
		this.addComponent(dummy);

		this.addComponent(this.floor);
		this.floor.addComponent(new ColliderBehavior({ type: Colliders.Box({ x:100, y:1, z:100 }) }))

		this.player.position.set(0, 4, 0);
		this.player.rotationRoot.addComponent(this.guns);
		this.activeCamera = this.player.camera;
		this.addComponent(this.player);

		this.environment.intensity = .5;
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
