import { Actor } from "../../src/Scene/Actor.ts";
import { ColliderBehavior, Colliders } from "../../src/Physics/ColliderBehavior.ts";
import { KeyCode } from "../../src/Input/KeyCode.ts";
import Rapier from "@dimforge/rapier3d-compat";
import * as Three from "three";
import { RigidBodyBehavior } from "../../src/Physics/RigidBody.ts";

export class Player extends Actor
{
	controller?: Rapier.KinematicCharacterController;

	capsule: ColliderBehavior = new ColliderBehavior({
		type: Colliders.Capsule(1, .5)
	})

	rBody = new RigidBodyBehavior({ type: Rapier.RigidBodyType.KinematicVelocityBased })

	desiredTranslation = new Three.Vector3(0, 0, 0)

	onCreate()
	{
		this.addComponent(this.capsule)
		this.addComponent(this.rBody)
		this.controller = this.scene!.physics!.getCharacterController(
			this.scene!.physics!.addCharacterController({ offset: 0.01 })
		)
	}

	onStart()
	{
		this.controller?.setApplyImpulsesToDynamicBodies(true)
		this.position.y = 2;
	}

	onBeforePhysicsUpdate(delta: number, elapsed: number)
	{
		if(!this.controller || !this.capsule.collider) return;

		this.desiredTranslation.set(
			(this.app!.input!.isDown(KeyCode.D) ? 5 * delta : 0) - (this.app!.input!.isDown(KeyCode.A) ? 5 * delta : 0),
			-9.81 * delta,
			(this.app!.input!.isDown(KeyCode.S) ? 5 * delta : 0) - (this.app!.input!.isDown(KeyCode.W) ? 5 * delta : 0)
		)

		this.controller.computeColliderMovement(
			this.capsule.collider,
			this.desiredTranslation,
		)
	}
}