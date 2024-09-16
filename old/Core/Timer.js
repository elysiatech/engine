export class Timer {
    autoStart = true;
    startTime = 0;
    oldTime = 0;
    elapsedTime = 0;
    running = false;
    constructor(args = {}) {
        if (typeof args.autoStart !== "undefined") {
            this.autoStart = args.autoStart;
        }
    }
    start() {
        this.startTime = performance.now();
        this.oldTime = this.startTime;
        this.elapsedTime = 0;
        this.running = true;
    }
    stop() {
        this.getElapsedTime();
        this.running = false;
        this.autoStart = false;
    }
    getElapsedTime() {
        this.getDelta();
        return this.elapsedTime;
    }
    getDelta() {
        let diff = 0;
        if (this.autoStart && !this.running) {
            this.start();
            return 0;
        }
        if (this.running) {
            const newTime = performance.now();
            diff = (newTime - this.oldTime) / 1000;
            this.oldTime = newTime;
            this.elapsedTime += diff;
        }
        return diff;
    }
}
