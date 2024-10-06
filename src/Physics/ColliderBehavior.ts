import * as Three from "three";
import Rapier from "@dimforge/rapier3d-compat";
import { Behavior } from "../Scene/Behavior";
import { QuaternionLike, Vector3Like } from "../Math/Vectors.ts";

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
	}

	onCreate() {
		this.scene?.physics!.addCollider(this)
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

	onDestroy() {
		this.scene?.physics!.destroyCollider(this)
	}
}