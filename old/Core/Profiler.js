export class Profiler {
    app;
    avgFrameTimeThreshold = 1000 / 30;
    constructor(app) {
        this.app = app;
    }
    updateFrameTime(delta) {
        this.deltas.push(delta);
        if (this.deltas.length > 20) {
            this.deltas.shift();
        }
    }
    onIncline;
    onDecline;
    deltas = [];
}
