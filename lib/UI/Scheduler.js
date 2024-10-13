export class Scheduler {
    frametime = 0;
    components = new Set;
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
