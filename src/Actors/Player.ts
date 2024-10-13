import { Actor } from "../Scene/Actor";
import { ColliderBehavior, Colliders } from "../Physics/ColliderBehavior";
import { KeyCode } from "../Input/KeyCode";
import Rapier from "@dimforge/rapier3d-compat";
import * as Three from "three";
import { RigidBodyBehavior } from "../Physics/RigidBody";
import { PerspectiveCameraActor } from "./PerspectiveCameraActor";
import { ActiveCameraTag } from "../Core/Tags";
import { Behavior } from "../Scene/Behavior";
import { clamp } from "../Math/Other";

function applyFriction(vector: Three.Vector2, decel: number, maxVelocity: number, delta: number)
{
	const speed = vector.length();
	if (speed > 0) {
		const frictionMagnitude = Math.min(speed, decel * delta);
		vector.multiplyScalar(Math.max(0, speed - frictionMagnitude) / speed);
	}
	return vector.clampLength(0, maxVelocity);
}


class FPSController extends Behavior
{
	isLocked = false;

	domElement?: HTMLElement;

	sensitivity = 0.001;

	get target() { return this.parent?.object3d! }

	constructor() {
		super();
		this.onConnect = this.onConnect.bind(this);
		this.onDisconnect = this.onDisconnect.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onPointerLockChange = this.onPointerLockChange.bind(this);
		this.onPointerLockError = this.onPointerLockError.bind(this);
		this.lock = this.lock.bind(this);
		this.unlock = this.unlock.bind(this);
	}

	override onCreate()
	{
		this.domElement = this.app!.renderPipeline.getRenderer().domElement

		this.onConnect();
	}

	onConnect()
	{
		this.domElement?.ownerDocument.addEventListener( 'mousemove', this.onMouseMove );
		this.domElement?.ownerDocument.addEventListener( 'pointerlockchange', this.onPointerLockChange );
		this.domElement?.ownerDocument.addEventListener( 'pointerlockerror', this.onPointerLockError );
		this.domElement?.addEventListener( 'click', () => this.lock() );
	}

	onDisconnect()
	{
		this.domElement?.ownerDocument.removeEventListener( 'mousemove', this.onMouseMove );
		this.domElement?.ownerDocument.removeEventListener( 'pointerlockchange', this.onPointerLockChange );
		this.domElement?.ownerDocument.removeEventListener( 'pointerlockerror', this.onPointerLockError );
	}

	onMouseMove = (event: MouseEvent) =>
	{
		if (!this.enabled || !this.isLocked || !this.parent || !this.parent) return;

		const movementX = event.movementX ?? 0;
		const movementY = event.movementY ?? 0;

		this.euler.y -= movementX * this.sensitivity;
		this.euler.x -= movementY * this.sensitivity;
		this.euler.x = Math.min(Math.max(this.euler.x, -1.0472), 1.0472);

		this.target.quaternion.setFromEuler(this.euler);
	}

	onPointerLockChange = (event: Event) => this.isLocked = this.domElement?.ownerDocument.pointerLockElement === this.domElement;

	onPointerLockError = (event: Event) => console.error(event)

	lock() { this.domElement?.requestPointerLock(); }

	unlock() { this.domElement?.ownerDocument.exitPointerLock(); }

	override destructor() {
		super.destructor();
		this.onDisconnect();
	}

	private euler = new Three.Euler(0, 0, 0, 'YXZ');
}

export class Player extends Actor
{
	acceleration = 80;

	maxVelocity = 6;

	deceleration = 30;

	inputVector = new Three.Vector3(0, 0, 0)

	velocity = new Three.Vector3(0, 0, 0)

	grounded = 1;

	desiredTranslation = new Three.Vector3(0, 0, 0)

	computedTranslation = new Three.Vector3(0, 0, 0)

	controller?: Rapier.KinematicCharacterController;

	collider: ColliderBehavior = new ColliderBehavior({
		type: Colliders.Capsule(1, .5)
	})

	rBody = new RigidBodyBehavior({ type: Rapier.RigidBodyType.KinematicVelocityBased })

	rotationRoot = new Actor;

	camera = new PerspectiveCameraActor;

	get isDown() { return this.app!.input.isDown.bind(this.app?.input) }

	constructor() {
		super();
		this.camera.addTag(ActiveCameraTag)
	}

	onCreate()
	{
		this.addComponent(this.rotationRoot)
		this.addComponent(this.collider)
		this.addComponent(this.rBody)

		this.controller = this.scene!.physics!.getCharacterController(
			this.scene!.physics!.addCharacterController({ offset: 0.01 })
		)
		this.controller?.setApplyImpulsesToDynamicBodies(true)

		this.camera.position.set(0, .8, 0)
		this.rotationRoot.addComponent(this.camera)

		this.rotationRoot.addComponent(new FPSController)

		this.position.y = 2;

		this.app!.input.onKeyDown(KeyCode.Space, () => {
			if(this.grounded)
			{
				this.velocity.y = 5;
				this.grounded = 0;
			}
		})
	}

	onBeforePhysicsUpdate(delta: number, elapsed: number)
	{
		if(!this.controller || !this.collider.collider) return;

		this.inputVector.set(0, 0, 0);


		if (this.isDown(KeyCode.S)) this.inputVector.z += 1;
		if (this.isDown(KeyCode.W)) this.inputVector.z -= 1;
		if (this.isDown(KeyCode.D)) this.inputVector.x += 1;
		if (this.isDown(KeyCode.A)) this.inputVector.x -= 1;

		// Normalize input vector if it's not zero
		if (this.inputVector.lengthSq() > 0) this.inputVector.normalize();

		const rotationMatrix = new Three.Matrix4().makeRotationFromQuaternion(this.rotationRoot!.quaternion);

		this.inputVector.applyMatrix4(rotationMatrix);

		this.velocity.y = clamp(this.velocity.y - 9.81 * delta, -30, 30);

		const horizontalVelocity = new Three.Vector2(this.velocity.x, this.velocity.z);
		const horizontalInput = new Three.Vector2(this.inputVector.x, this.inputVector.z);

		if (horizontalInput.lengthSq()) {
			const bounds = this.maxVelocity * horizontalInput.length();
			horizontalVelocity.add(horizontalInput.multiplyScalar(this.acceleration * delta * this.grounded ));
			horizontalVelocity.clampLength(0, bounds);
		} else {
			applyFriction(horizontalVelocity, this.deceleration, this.maxVelocity, delta);
		}

		this.velocity.x = horizontalVelocity.x;
		this.velocity.z = horizontalVelocity.y;

		this.desiredTranslation.setScalar(0).add(this.velocity.clone().multiplyScalar(delta))

		this.controller.computeColliderMovement(
			this.collider.collider,
			this.desiredTranslation,
		);

		this.computedTranslation.copy(this.controller.computedMovement())

		this.rBody.setLinearVelocity(this.computedTranslation.divideScalar(delta));

		this.grounded = this.controller.computedGrounded() ? 1 : 0;
	}

}

const isZero = (v: number) => Math.abs(v) < 0.00001;
