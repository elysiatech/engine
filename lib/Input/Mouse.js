export class MouseObserver {
    target;
    get x() { return this.#x; }
    get y() { return this.#y; }
    get leftDown() { return this.#mouseDown.left; }
    get middleDown() { return this.#mouseDown.middle; }
    get rightDown() { return this.#mouseDown.right; }
    get fourDown() { return this.#mouseDown.four; }
    get fiveDown() { return this.#mouseDown.five; }
    constructor(target) {
        this.target = target;
        target.addEventListener("mousemove", this.#onMouseMove);
        target.addEventListener("mousedown", this.#onMouseDown);
        target.addEventListener("mouseup", this.#onMouseUp);
    }
    addEventListener(type, callback) {
        this.#subscribers.set(type, this.#subscribers.get(type) ?? new Set());
        this.#subscribers.get(type).add(callback);
        return () => this.removeEventListener(type, callback);
    }
    removeEventListener(type, callback) {
        const subs = this.#subscribers.get(type);
        if (subs) {
            subs.delete(callback);
        }
    }
    destructor() {
        window.removeEventListener("mousemove", this.#onMouseMove);
        for (const subs of this.#subscribers.values()) {
            subs.clear();
        }
    }
    #x = 0;
    #y = 0;
    #mouseDown = {
        left: false,
        middle: false,
        right: false,
        four: false,
        five: false,
    };
    #subscribers = new Map;
    #onMouseMove = (event) => {
        this.#x = event.clientX;
        this.#y = event.clientY;
        const subs = this.#subscribers.get("mousemove");
        if (subs) {
            for (const subscriber of subs) {
                subscriber(event);
            }
        }
    };
    #onMouseDown = (event) => {
        const key = event.button;
        switch (key) {
            case 0:
                this.#mouseDown.left = true;
                break;
            case 1:
                this.#mouseDown.middle = true;
                break;
            case 2:
                this.#mouseDown.right = true;
                break;
            case 3:
                this.#mouseDown.four = true;
                break;
            case 4:
                this.#mouseDown.five = true;
                break;
        }
        const subs = this.#subscribers.get("mousedown");
        if (subs) {
            for (const subscriber of subs) {
                subscriber(event);
            }
        }
    };
    #onMouseUp = (event) => {
        const key = event.button;
        switch (key) {
            case 0:
                this.#mouseDown.left = false;
                break;
            case 1:
                this.#mouseDown.middle = false;
                break;
            case 2:
                this.#mouseDown.right = false;
                break;
            case 3:
                this.#mouseDown.four = false;
                break;
            case 4:
                this.#mouseDown.five = false;
                break;
        }
        const subs = this.#subscribers.get("mouseup");
        if (subs) {
            for (const subscriber of subs) {
                subscriber(event);
            }
        }
    };
}
