export class ElysiaEvent {
    value;
    timestamp = performance.now();
    constructor(value) {
        this.value = value;
    }
}
export class BeginLoadEvent extends ElysiaEvent {
}
export class ProgressEvent extends ElysiaEvent {
}
export class ErrorEvent extends ElysiaEvent {
}
export class LoadedEvent extends ElysiaEvent {
}
