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

const applyFriction = (value: number, decel: number, maxVelocity: number, delta: number) =>
	clamp(Math.abs(value) < decel*delta ? 0 : value - Math.sign(value) * decel*delta, -maxVelocity, maxVelocity)

class FPSController extends Behavior
{
	isLocked = false;

	domElement?: HTMLElement;

	sensitivity = 0.005;

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
	acceleration = 60;

	maxVelocity = 30;

	deceleration = 50;

	inputVector = new Three.Vector3(0, 0, 0)

	velocity = new Three.Vector3(0, 0, 0)

	inAir = false;

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

		this.camera.debug = true;
		this.camera.position.set(0, .8, 0)
		this.camera.addTag(ActiveCameraTag)
		this.rotationRoot.addComponent(this.camera)

		this.rotationRoot.addComponent(new FPSController)

		this.position.y = 2;
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

		this.desiredTranslation.set(0, 0, 0);

		// this.velocity.y = clamp(this.velocity.y - 9.81 * delta, -30, 30);

		if(isZero(this.inputVector.x))
		{
			this.velocity.x = applyFriction(this.velocity.x, this.deceleration, this.maxVelocity, delta);
		}
		else
		{
			const bounds = Math.abs(this.maxVelocity * this.inputVector.x);
			this.velocity.x = clamp(this.velocity.x + this.inputVector.x * this.acceleration * delta, -bounds, bounds);
		}

		if(isZero(this.inputVector.z))
		{
			this.velocity.z = applyFriction(this.velocity.z, this.deceleration, this.maxVelocity, delta);
		}
		else
		{
			const bounds = Math.abs(this.maxVelocity * this.inputVector.z);
			this.velocity.z = clamp(this.velocity.z + this.inputVector.z * this.acceleration * delta, -bounds, bounds);
		}

		console.log(Number(this.velocity.x.toFixed(2)), Number(this.velocity.z.toFixed(2)))

		this.desiredTranslation.add(this.velocity.clone().multiplyScalar(delta))

		this.controller.computeColliderMovement(
			this.collider.collider,    // The collider we would like to move.
			this.desiredTranslation,
		);

		this.computedTranslation.copy(this.controller.computedMovement())
		
		this.rBody.setLinearVelocity(this.computedTranslation.divideScalar(delta));

		this.inAir = !this.controller.computedGrounded();
	}

}

const isZero = (v: number) => Math.abs(v) < 0.00001;

const neverNaN = (v: number) => isNaN(v) ? 0 : v;