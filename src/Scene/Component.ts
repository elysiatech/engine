import { Actor } from "./Actor";
import { Behavior } from "./Behavior";

/**
 * A Component is an Actor or Behavior that satisfies the ActorLifecycle interface.
 */
export type Component = Actor | Behavior;

/**
 * Returns true if the component is an Actor.
 * @param component
 */
export function isActor(component: any): component is Actor
{
	return component instanceof Actor;
}

/**
 * Returns true if the component is a Behavior.
 * @param component
 */
export function isBehavior(component: any): component is Behavior
{
	return component instanceof Behavior;
}

/**
 * Returns true if the component satisfies the Component interface.
 * @param component
 */
export function isComponent(component: any): component is Component
{
	return isActor(component) || isBehavior(component);
}
