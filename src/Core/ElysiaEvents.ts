import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ElysiaEvent } from "../Events/Event";
import { Actor } from "../Scene/Actor";
import { Behavior } from "../Scene/Behavior";
import { Component } from "../Scene/Component";

export const ElysiaEvents = new ElysiaEventDispatcher;

export class TagAddedEvent extends ElysiaEvent<{ tag: any, target: Component }>{}
export class TagRemovedEvent extends ElysiaEvent<{ tag: any, target: Component }>{}

export class ComponentAddedEvent extends ElysiaEvent<{ parent: Actor, child: Component }>{}
export class ComponentRemovedEvent extends ElysiaEvent<{ parent: Actor, child: Component }>{}