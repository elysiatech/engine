import { ElysiaEventDispatcher } from "../Events/EventDispatcher.ts";
import { ElysiaEvent } from "../Events/Event.ts";
import { Actor } from "../Scene/Actor.ts";
import { Component } from "../Scene/Component.ts";
export declare const ElysiaEvents: ElysiaEventDispatcher;
export declare class TagAddedEvent extends ElysiaEvent<{
    tag: any;
    target: Component;
}> {
}
export declare class TagRemovedEvent extends ElysiaEvent<{
    tag: any;
    target: Component;
}> {
}
export declare class ComponentAddedEvent extends ElysiaEvent<{
    parent: Actor;
    child: Component;
}> {
}
export declare class ComponentRemovedEvent extends ElysiaEvent<{
    parent: Actor;
    child: Component;
}> {
}
