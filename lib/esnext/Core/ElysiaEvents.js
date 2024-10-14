import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ElysiaEvent } from "../Events/Event.js";
export const ElysiaEvents = new ElysiaEventDispatcher;
export class TagAddedEvent extends ElysiaEvent {
}
export class TagRemovedEvent extends ElysiaEvent {
}
export class ComponentAddedEvent extends ElysiaEvent {
}
export class ComponentRemovedEvent extends ElysiaEvent {
}
