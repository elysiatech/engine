export class ElysiaEvent {
    constructor(value) {
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
        });
        Object.defineProperty(this, "timestamp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: performance.now()
        });
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
