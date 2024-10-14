import { RigidBodyBehavior } from "./RigidBody.js";
export function findAncestorRigidbody(actor) {
    if (!actor)
        return undefined;
    if (actor.type === "Scene")
        return undefined;
    let rb = actor.getComponentsByType(RigidBodyBehavior);
    if (rb.first)
        return rb.first;
    if (!actor.parent || actor.parent.type === "Scene")
        return undefined;
    rb = actor.parent.getComponentsByType(RigidBodyBehavior);
    if (rb.first)
        return rb.first;
    return findAncestorRigidbody(actor.parent);
}
