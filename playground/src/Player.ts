import { Actor } from "../../src/Scene/Actor.ts";
import { ColliderBehavior, Colliders } from "../../src/Physics/ColliderBehavior.ts";
import { KeyCode } from "../../src/Input/KeyCode.ts";
import Rapier from "@dimforge/rapier3d-compat";
import * as Three from "three";
import { RigidBodyBehavior } from "../../src/Physics/RigidBody.ts";
import { PerspectiveCameraActor } from "../../src/Actors/PerspectiveCameraActor.ts";
import { ActiveCameraTag } from "../../src/Core/Tags.ts";
import { Behavior } from "../../src/Scene/Behavior.ts";
import { clamp } from "../../src/Math/Other.ts";

const _euler = new Three.Euler( 0, 0, 0, 'YXZ' );
const _vector = new Three.Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class MouseControlBehavior extends Behavior
{
	isLocked = false;

	pointerSpeed = 1;

	minPolarAngle = 0; // radians

	maxPolarAngle = Math.PI; // radians

	camera?: PerspectiveCameraActor;

	domElement?: HTMLElement;

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

	getDirection(v: Three.Vector3)
	{
		if(!this.camera) return v.set(0, 0, -1);
		return v.set( 0, 0, - 1 ).applyQuaternion( this.camera!.quaternion );
	}

	onCreate()
	{
		this.camera = this.parent?.getComponentsByType(PerspectiveCameraActor).first;
		if(!this.camera) throw new Error("No camera found")
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
		if (!this.enabled || !this.isLocked || !this.camera || !this.parent) return;
		const movementX = event.movementX ?? event.mozMovementX ?? event.webkitMovementX ?? 0;
		const movementY = event.movementY ?? event.mozMovementY ?? event.webkitMovementY ?? 0;
		const camera = this.camera.object3d;
		_euler.setFromQuaternion( camera.quaternion );
		_euler.y -= movementX * 0.002 * this.pointerSpeed;
		_euler.x -= movementY * 0.002 * this.pointerSpeed;
		_euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );
		camera.quaternion.setFromEuler( _euler );
		this.parent!.rotation.y = camera.rotation.y;
	}

	onPointerLockChange = (event: Event) =>
	{
		if (this.domElement?.ownerDocument.pointerLockElement === this.domElement ) this.isLocked = true;
		else this.isLocked = false;
	}

	onPointerLockError = (event: Event) =>
	{
		console.error(event)
	}

	lock() {
		this.domElement?.requestPointerLock();
	}

	unlock() {
		this.domElement?.ownerDocument.exitPointerLock();
	}

	destructor() {
		super.destructor();
		this.onDisconnect();
	}
}

const enforceNumber = (value: number) => isNaN(value) ? 0 : value;

export class Player extends Actor
{
	controller?: Rapier.KinematicCharacterController;

	collider: ColliderBehavior = new ColliderBehavior({
		type: Colliders.Capsule(1, .5)
	})

	speed = 5;

	rBody = new RigidBodyBehavior({ type: Rapier.RigidBodyType.KinematicVelocityBased })

	velocity = new Three.Vector3(0, 0, 0)

	desiredTranslation = new Three.Vector3(0, 0, 0)

	camera = new PerspectiveCameraActor;

	constructor() {
		super();
		this.camera.addTag(ActiveCameraTag)
		this.addComponent(new MouseControlBehavior)
		this.camera.fov = 75;
	}

	onCreate()
	{
		this.addComponent(this.collider)
		this.addComponent(this.rBody)

		this.controller = this.scene!.physics!.getCharacterController(
			this.scene!.physics!.addCharacterController({ offset: 0.01 })
		)

		this.camera.debug = true;
		this.camera.position.set(0, .8, 0)
		this.addComponent(this.camera)
	}

	onStart()
	{
		this.controller?.setApplyImpulsesToDynamicBodies(true)
		this.position.y = 2;
	}

	inAir = false;

	onBeforePhysicsUpdate(delta: number, elapsed: number)
	{
		if(!this.controller || !this.collider.collider) return;

		const accelerate = (value: number, accel: number, dir: number, maxVelocity: number, delta: number) => clamp(value + dir*accel*delta, -maxVelocity, maxVelocity);
		const applyFriction = (value: number, decel: number, maxVelocity: number, delta: number) => clamp(Math.abs(value) < decel*delta ? 0 : value - Math.sign(value) * decel*delta, 0, maxVelocity);

		const input = this.app!.input;
		const maxVelocity = 10;
		const accel = 80;
		const decel = 20;

		const inputVector = new Three.Vector3;

		if (input.isDown(KeyCode.S)) inputVector.z += 1;
		if (input.isDown(KeyCode.W)) inputVector.z -= 1;
		if (input.isDown(KeyCode.D)) inputVector.x += 1;
		if (input.isDown(KeyCode.A)) inputVector.x -= 1;

		// Normalize input vector if it's not zero
		if (inputVector.lengthSq() > 0) {
			inputVector.normalize();
		}

		// Apply acceleration or friction
		this.velocity.x = inputVector.x !== 0
			? accelerate(this.velocity.x, accel, inputVector.x, maxVelocity, delta)
			: applyFriction(this.velocity.x, decel, maxVelocity, delta);

		this.velocity.z = inputVector.z !== 0
			? accelerate(this.velocity.z, accel, inputVector.z, maxVelocity, delta)
			: applyFriction(this.velocity.z, decel, maxVelocity, delta);

		// Create rotation matrix from camera's quaternion
		const rotationMatrix = new Three.Matrix4().makeRotationFromQuaternion(this.camera.quaternion);

		// Apply rotation to velocity
		const adjustedVelocity = this.velocity.clone().applyMatrix4(rotationMatrix);

		// Set the adjusted velocity
		this.velocity.copy(adjustedVelocity);

		// Calculate desired translation
		this.desiredTranslation.copy(this.velocity).multiplyScalar(delta);

		this.controller.computeColliderMovement(
			this.collider.collider,    // The collider we would like to move.
			this.desiredTranslation,
		);

		const computedTranslation = this.controller.computedMovement();

		const finalVelocity = new Three.Vector3(
			enforceNumber(computedTranslation.x / delta),
			enforceNumber(computedTranslation.y / delta),
			enforceNumber(computedTranslation.z / delta)
		)

		this.rBody.setLinearVelocity(finalVelocity)

		this.inAir = !this.controller.computedGrounded();
	}

}

/*
	MaxVelocity = 5au/s
	Velocity = 0;
	Acceleration = 2au/s

	For each direction (left, right, forward, backward) we adjust the velocity
	by the acceleration, using either the acceleration or negative acceleration
	depending on the direction and if the key is pressed. Each axis is capped at the
	max velocity.

 */