import { IsActor } from "./Actor";
import { IsBehavior } from "./Behavior";
/**
 * Returns true if the component is an Actor.
 * @param component
 */
export function isActor(component) {
    return IsActor in component;
}
/**
 * Returns true if the component is a Behavior.
 * @param component
 */
export function isBehavior(component) {
    return IsBehavior in component;
}
/**
 * Returns true if the component satisfies the Component interface.
 * @param component
 */
export function isComponent(component) {
    return isActor(component) || isBehavior(component);
}
