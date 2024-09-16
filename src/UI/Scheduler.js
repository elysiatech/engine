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
            component.requestRender();
        }
        this.frametime = Math.round(((performance.now() - t) + Number.EPSILON) * 100) / 100;
    }
}
export const defaultScheduler = new Scheduler;
if (typeof document !== "undefined") {
    const render = () => {
        requestAnimationFrame(render);
        defaultScheduler.update();
    };
    requestAnimationFrame(render);
}
