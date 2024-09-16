export var EventQueueMode;
(function (EventQueueMode) {
    EventQueueMode[EventQueueMode["Immediate"] = 0] = "Immediate";
    EventQueueMode[EventQueueMode["Queued"] = 1] = "Queued";
})(EventQueueMode || (EventQueueMode = {}));
export class EventQueue {
    mode = EventQueueMode.Immediate;
    queue = [];
    emit(type, data) {
        const t = typeof type === "string" || typeof type === "symbol" ? type : type.type;
        if (this.mode === EventQueueMode.Queued) {
            this.queue.push({ type: t, data, timestamp: Date.now() });
        }
        else {
            this.emitSync(t, data);
        }
    }
    emitSync(type, data) {
        const t = typeof type === "string" || typeof type === "symbol" ? type : type.type;
        this.subscribers.get(t)?.forEach((handler) => handler(data, this));
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
