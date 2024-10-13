import { Actor } from "../Scene/Actor";
import { RigidBodyBehavior } from "./RigidBody";

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