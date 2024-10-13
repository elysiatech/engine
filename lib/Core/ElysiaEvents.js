import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ElysiaEvent } from "../Events/Event";
export const ElysiaEvents = new ElysiaEventDispatcher;
export class TagAddedEvent extends ElysiaEvent {
}
export class TagRemovedEvent extends ElysiaEvent {
}
export class ComponentAddedEvent extends ElysiaEvent {
}
export class ComponentRemovedEvent extends ElysiaEvent {
}
