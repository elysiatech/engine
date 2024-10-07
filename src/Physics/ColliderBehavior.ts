import * as Three from "three";
import * as THREE from "three"
import Rapier from "@dimforge/rapier3d-compat";
import { Behavior } from "../Scene/Behavior";
import { QuaternionLike, Vector3Like } from "../Math/Vectors.ts";
import { findAncestorRigidbody } from "./FindAncestorRigidbody.ts";

export const Colliders = {
	Box: (scale: Vector3Like) => (worldScale: Vector3Like) => Rapier.ColliderDesc.cuboid((scale.x*worldScale.x)/2, (scale.y*worldScale.y)/2, (scale.z*worldScale.z)/2),
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

type ColliderCreationFunction = (worldScale: Vector3Like) => Rapier.ColliderDesc;

interface ColliderBehaviorArguments
{
	type: (worldScale: Vector3Like) => Rapier.ColliderDesc;
	sensor?: boolean;
	density?: number;
	mass?: number;
	friction?: number;
	restitution?: number;
}

export class ColliderBehavior extends Behavior
{
	override type = "ColliderBehavior";

	colliderDescriptionConstructor: ColliderCreationFunction;

	colliderDescription?: Rapier.ColliderDesc;

	handle?: number;

	get collider(): Rapier.Collider | undefined { return this.scene?.physics?.getCollider(this.handle) }

	hasParentRigidBody = false;

	constructor(args: ColliderBehaviorArguments) {
		super();
		this.addTag(ColliderBehavior)
		this.colliderDescriptionConstructor = args.type;
		// todo: adjust the scale of the collider's settings based on the world scale of the parent object.
	}

	onEnterScene()
	{
		if(this.collider) return;
		const worldScale = this.parent!.object3d.getWorldScale(new Three.Vector3(1,1,1))
		console.log('worldScale',worldScale)
		this.colliderDescription = this.colliderDescriptionConstructor(worldScale);
		console.log('this.colliderDescription',this.colliderDescription)
		this.scene?.physics!.addCollider(this)
	}

	override onBeforePhysicsUpdate(delta: number, elapsed: number)
	{
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
			const parentRigidBody = findAncestorRigidbody(this.parent!);
			if (!parentRigidBody || !parentRigidBody.rBody) return;

			const rigidBody = parentRigidBody.rBody;

			// Create matrices
			const rbWorldMatrix = temp.m1.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
			const parentWorldMatrix = temp.m2.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
			const relativeMatrix = temp.m3.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

			// Set rigid body's world transform
			rbWorldMatrix.compose(
				temp.v1.set(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z),
				temp.q1.set(rigidBody.rotation().x, rigidBody.rotation().y, rigidBody.rotation().z, rigidBody.rotation().w),
				temp.v2.set(1, 1, 1)  // Assuming no scale
			);

			// Get collider parent's world transform
			this.parent!.object3d.updateWorldMatrix(true, false);
			parentWorldMatrix.copy(this.parent!.object3d.matrixWorld);

			// Calculate relative transform
			relativeMatrix.copy(rbWorldMatrix).invert().multiply(parentWorldMatrix);

			// Extract position and rotation from the relative matrix
			const relativePosition = temp.v3.setScalar(0)
			const relativeQuaternion = temp.q2.set(0, 0, 0, 1);
			const relativeScale = temp.v4.setScalar(1);
			relativeMatrix.decompose(relativePosition, relativeQuaternion, relativeScale);

			// Set collider's position and rotation relative to the parent rigid body
			c.setTranslationWrtParent(relativePosition);
			c.setRotationWrtParent(relativeQuaternion);
		}
		else
		{
			this.parent!.object3d.getWorldPosition(temp.v1);
			this.parent!.object3d.getWorldQuaternion(temp.q1)
			c.setTranslation(temp.v1);
			c.setRotation(temp.q1);
		}
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
	q3: new Three.Quaternion(),
	q4: new Three.Quaternion(),
	v1: new Three.Vector3(),
	v2: new Three.Vector3(),
	v3: new Three.Vector3(),
	v4: new Three.Vector3(),
	m1: new Three.Matrix4(),
	m2: new Three.Matrix4(),
	m3: new Three.Matrix4(),
	m4: new Three.Matrix4(),
}