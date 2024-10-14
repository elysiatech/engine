import { Actor } from "../Scene/Actor.ts";
import { RigidBodyBehavior } from "./RigidBody.ts";

export function findAncestorRigidbody(actor?: Actor): RigidBodyBehavior | undefined {
	if (!actor) return undefined;
	if (actor.type === "Scene") return undefined;

	let rb = actor.getComponentsByType(RigidBodyBehavior);
	if (rb.first) return rb.first
	if (!actor.parent || actor.parent.type === "Scene") return undefined;
	rb = actor.parent.getComponentsByType(RigidBodyBehavior);
	if (rb.first) return rb.first
	return findAncestorRigidbody(actor.parent);
}