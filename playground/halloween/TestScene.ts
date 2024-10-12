import { Scene } from "../../src/Scene/Scene.ts";
import { EnvironmentActor } from "../../src/Actors/EnvironmentActor.ts";
import { Player } from "../../src/Actors/Player.ts";
import { PhysicsController } from "../../src/Physics/PhysicsController.ts";
import { CubeActor } from "../../src/Actors/Primitives.ts";
import { Colors } from "../../src/Core/Colors.ts";
import * as Three from "three"
import { ColliderBehavior, Colliders } from "../../src/Physics/ColliderBehavior.ts";
import "../../src/UI/ElysiaCrossHair.ts";
import { Actor } from "../../src/Scene/Actor.ts";

class FirstPersonWeaponRig extends Actor
{

	onCreate() {
		this.addComponent(new CubeActor(Colors.Purple, new Three.Vector3(.5, 0, -2), undefined, new Three.Vector3(.2, .2, 1)));
	}

}

export class TestScene extends Scene
{
	environment = new EnvironmentActor;

	player = new Player;

	guns = new FirstPersonWeaponRig;

	floor = new CubeActor(Colors.Cullen, new Three.Vector3(0, -.51, 0), undefined, new Three.Vector3(100, 1, 100));

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