export class Scheduler {
    constructor() {
        Object.defineProperty(this, "frametime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "components", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set
        });
    }
    subscribe(component) {
        this.components.add(component);
    }
    unsubscribe(component) {
        this.components.delete(component);
    }
    update() {
        const t = performance.now();
        for (const component of this.components) {
            component._onUpdate();
        }
        this.frametime = performance.now() - t;
    }
}
export const defaultScheduler = new Scheduler;
