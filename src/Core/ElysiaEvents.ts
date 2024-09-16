import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ElysiaEvent } from "../Events/Event";

export const ElysiaEvents = new ElysiaEventDispatcher;

export class IDSetEvent extends ElysiaEvent<{}>{}
export class TagAddedEvent extends ElysiaEvent<{}>{}
export class TagRemovedEvent extends ElysiaEvent<{}>{}
