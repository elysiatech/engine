export class Profiler {
    handler;
    deltas = [];
    average = 0;
    constructor(handler) {
        this.handler = handler;
    }
    onUpdate(delta) {
        this.deltas.push(delta);
        if (this.deltas.length > 30) {
            this.deltas.shift();
        }
        else if (this.deltas.length < 30) {
            return;
        }
        this.average = average(this.deltas);
        if (this.handler) {
            if (this.average > this.handler.threshold) {
                this.handler.onDown();
            }
            else {
                this.handler.onUp();
            }
        }
    }
}
const average = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
};
