export var EventQueueMode;
(function (EventQueueMode) {
    EventQueueMode[EventQueueMode["Immediate"] = 0] = "Immediate";
    EventQueueMode[EventQueueMode["Queued"] = 1] = "Queued";
})(EventQueueMode || (EventQueueMode = {}));
export class Event {
    type;
    data;
    timeStamp;
    constructor(data) {
        this.timeStamp = Date.now();
        this.data = data;
    }
}
export class EventQueue {
    mode = EventQueueMode.Immediate;
    queue = [];
    emit(type, data) {
        if (this.mode === EventQueueMode.Queued) {
            if (typeof type === "function") {
                this.queue.push(new type(data));
            }
            else {
                const e = new Event(data);
                e.type = type;
                this.queue.push(e);
            }
        }
        else {
            this.emitSync(type, data);
        }
    }
    emitSync(type, data) {
        this.subscribers.get(type)?.forEach((handler) => handler(data, this));
    }
    subscribe(type, handler) {
        const t = typeof type === "string" || typeof type === "symbol" ? type : type.type;
        if (!this.subscribers.has(t)) {
            this.subscribers.set(t, new Set());
        }
        this.subscribers.get(t).add(handler);
        return () => void this.subscribers.get(t)?.delete(handler);
    }
    once(type, handler) {
        const unlisten = this.subscribe(type, (data, queue) => {
            unlisten();
            handler(data, queue);
        });
        return unlisten;
    }
    flush() {
        for (const event of this) {
            for (const sub of this.subscribers.get(event.type) ?? []) {
                sub(event.data, this);
            }
        }
    }
    *[Symbol.iterator]() {
        while (this.queue.length) {
            yield this.queue.shift();
        }
    }
    subscribers = new Map();
}
const eq = new EventQueue;
