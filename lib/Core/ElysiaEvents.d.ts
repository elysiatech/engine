import { ElysiaEvent } from "../Events/Event";
import { Actor } from "../Scene/Actor";
import { Component } from "../Scene/Component";
export declare const ElysiaEvents: any;
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
