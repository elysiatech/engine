/**
 * @internal
 * Used by Application to monitor the average frame delta and
 * call a handler when the average frame delta is greater or less than a threshold.
 */
export class Profiler {
    constructor(handler) {
        Object.defineProperty(this, "handler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: handler
        });
        Object.defineProperty(this, "deltas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "average", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    onUpdate(delta) {
        this.deltas.push(delta);
        if (this.deltas.length > 30) {
            this.deltas.shift();
        }
        else if (this.deltas.length < 30)
            return;
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
