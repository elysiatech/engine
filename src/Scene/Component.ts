import { Actor } from "./Actor";
import { Behavior } from "./Behavior";

export type Component = Actor | Behavior;

export function isActor(component: Component): component is Actor
{
	return component instanceof Actor;
}

export function isBehavior(component: Component): component is Behavior
{
	return component instanceof Behavior;
}

export function isComponent(component: any): component is Component
{
	return isActor(component) || isBehavior(component);
}
