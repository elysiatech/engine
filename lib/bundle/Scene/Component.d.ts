import { Actor } from "./Actor.ts";
import { Behavior } from "./Behavior.ts";
/**
 * A Component is an Actor or Behavior that satisfies the ActorLifecycle interface.
 */
export type Component = Actor | Behavior;
/**
 * Returns true if the component is an Actor.
 * @param component
 */
export declare function isActor(component: any): component is Actor;
/**
 * Returns true if the component is a Behavior.
 * @param component
 */
export declare function isBehavior(component: any): component is Behavior;
/**
 * Returns true if the component satisfies the Component interface.
 * @param component
 */
export declare function isComponent(component: any): component is Component;
