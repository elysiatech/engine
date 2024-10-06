import { Actor } from "../../src/Scene/Actor.ts";
import { ColliderBehavior, Colliders } from "../../src/Physics/ColliderBehavior.ts";
import { KeyCode } from "../../src/Input/KeyCode.ts";
import Rapier from "@dimforge/rapier3d-compat";
import * as Three from "three";
import { RigidBodyBehavior } from "../../src/Physics/RigidBody.ts";

export class Player extends Actor
{
	controllerHandle?: string;

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
		this.controllerHandle = this.scene!.physics!.addCharacterController({ offset: 0.01 })
	}

	onStart()
	{
		this.controller = this.scene!.physics!.getCharacterController(this.controllerHandle)
		this.controller?.setApplyImpulsesToDynamicBodies(true)
		this.app?.input.onKeyDown(KeyCode.Space, () => this.jump())
		this.rBody.setPosition(0, 2, 0)
	}

	onUpdate(delta: number, elapsed: number)
	{
		if(!this.controller || !this.capsule.collider) return;

		this.desiredTranslation.set(
			this.app!.input!.isDown(KeyCode.W) ? .1 : this.app!.input!.isDown(KeyCode.S) ? -.1 : 0,
			-9.81 + this.#yVelocity,
			this.app!.input!.isDown(KeyCode.A) ? .1 : this.app!.input!.isDown(KeyCode.D) ? -.1 : 0
		)

		this.controller.computeColliderMovement(
			this.capsule.collider,
			this.desiredTranslation,
		);

		this.rBody!.setLinearVelocity(
			new Rapier.Vector3(
				this.desiredTranslation.x * 10,
				this.#yVelocity,
				this.desiredTranslation.z * 10
			)
		)

	}

	jump()
	{
		this.#yVelocity = 10;
	}

	#yVelocity = 0;
}