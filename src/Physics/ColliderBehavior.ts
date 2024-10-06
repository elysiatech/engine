import * as Three from "three";
import Rapier from "@dimforge/rapier3d-compat";
import { Behavior } from "../Scene/Behavior";
import { QuaternionLike, Vector3Like } from "../Math/Vectors.ts";
import { findAncestorRigidbody } from "./FindAncestorRigidbody.ts";

export const Colliders = {
	Box: (scale: Vector3Like) => Rapier.ColliderDesc.cuboid(scale.x/2, scale.y/2, scale.z/2),
	Cylinder: (height: number, radius: number) => Rapier.ColliderDesc.cylinder(height/2, radius),
	Sphere: (radius: number) => Rapier.ColliderDesc.ball(radius),
	Cone: (height: number, radius: number) => Rapier.ColliderDesc.cone(height/2, radius),
	Capsule: (height: number, radius: number) => Rapier.ColliderDesc.capsule(height/2, radius),
	ConvexMesh: (points: Float32Array) => Rapier.ColliderDesc.convexHull(points)!,
	TriangleMesh: (vertices: Float32Array, indices: Uint32Array) =>
		Rapier.ColliderDesc.trimesh(vertices, indices),
	HeightField: (nrows: number, ncols: number, heights: Float32Array, scale: Rapier.Vector,) =>
		Rapier.ColliderDesc.heightfield(nrows, ncols, heights, scale),
}

interface ColliderBehaviorArguments
{
	type: Rapier.ColliderDesc;
	sensor?: boolean;
	density?: number;
	mass?: number;
	friction?: number;
	restitution?: number;
}

export class ColliderBehavior extends Behavior
{
	override type = "ColliderBehavior";

	colliderDescription: Rapier.ColliderDesc;

	handle?: number;

	get collider(): Rapier.Collider | undefined { return this.scene?.physics?.getCollider(this.handle) }

	get density() { return this.collider ? this.collider.density() : this.colliderDescription.density; }
	get mass() { return this.collider ? this.collider.mass() : this.colliderDescription.mass; }
	get friction() { return this.collider ? this.collider.friction() : this.colliderDescription.friction; }
	get restitution() { return this.collider ? this.collider.restitution() : this.colliderDescription.restitution; }
	get sensor() { return this.collider ? this.collider.isSensor() : this.colliderDescription.isSensor; }

	hasParentRigidBody = false;

	constructor(args: ColliderBehaviorArguments) {
		super();
		this.addTag(ColliderBehavior)
		this.colliderDescription = args.type
		const worldScale = this.parent?.object3d.getWorldScale(new Three.Vector3())
		// todo: adjust the scale of the collider's settings based on the world scale of the parent object.
	}

	onEnterScene()
	{
		this.scene?.physics!.addCollider(this)
	}

	// we need to update the collider position depending on transforms to the parent objects.
	onBeforePhysicsUpdate(delta: number, elapsed: number) {
		const c = this.collider;
		if(!c) return;

		if(this.#previousPosition.equals(this.parent!.object3d.position)
			&& this.#previousRotation.equals(this.parent!.object3d.quaternion)) return;

		// if the world scale has changed, we need to recreate the collider.
		if(!this.#previousScale.equals(this.parent!.object3d.getWorldScale(temp.v1)))
		{
			this.#previousScale.copy(temp.v1);
			// need to recreate the collider with the new scale.
		}

		this.#previousPosition.copy(this.parent!.object3d.position);
		this.#previousRotation.copy(this.parent!.object3d.quaternion);

		if(this.hasParentRigidBody)
		{
			// need to set offset between parent and the rigid body itself.

			const parentRigidBody = findAncestorRigidbody(this.parent!);
			if(!parentRigidBody) return;

			const rigidBody = parentRigidBody.rBody;
			if(!rigidBody) return;

			// world space of the rigid body
			temp.v1.copy(rigidBody.translation())
			temp.q1.copy(rigidBody.rotation())

			// world space of our parent
			this.parent!.object3d.getWorldPosition(temp.v2);
			this.parent!.object3d.getWorldQuaternion(temp.q2);

			// offset between the two
			temp.v2.sub(temp.v1);
			temp.q2.conjugate()
			temp.v2.applyQuaternion(temp.q2);

			c.setTranslationWrtParent(temp.v2);
			c.setRotationWrtParent(temp.q2);
		}
		else
		{
			this.parent!.object3d.getWorldPosition(temp.v1);
			this.parent!.object3d.getWorldQuaternion(temp.q1);
			c.setTranslation(temp.v1);
			c.setRotation(temp.q1);
		}
	}

	setDensity(density: number)
	{
		if(this.collider) this.collider.setDensity(density);
		else this.colliderDescription.setDensity(density);
	}

	setMass(mass: number)
	{
		if(this.collider) this.collider.setMass(mass);
		else this.colliderDescription.setMass(mass);
	}

	setFriction(friction: number)
	{
		if(this.collider) this.collider.setFriction(friction);
		else this.colliderDescription.setFriction(friction);
	}

	setRestitution(restitution: number)
	{
		if(this.collider) this.collider.setRestitution(restitution);
		else this.colliderDescription.setRestitution(restitution);
	}

	setSensor(isSensor: boolean)
	{
		if(this.collider) this.collider.setSensor(isSensor);
		else this.colliderDescription.setSensor(isSensor);
	}

	onLeaveScene()
	{
		this.scene?.physics!.destroyCollider(this)
	}

	#previousPosition = new Three.Vector3();
	#previousRotation = new Three.Quaternion();
	#previousScale = new Three.Vector3();
}

const temp = {
	q1: new Three.Quaternion(),
	q2: new Three.Quaternion(),
	v1: new Three.Vector3(),
	v2: new Three.Vector3(),
}