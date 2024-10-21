import { KeyCode } from "./KeyCode.js";
export class QueuedEvent {
    constructor(key = KeyCode.None, type = "down", timestamp = performance.now(), ctrlDown = false, shiftDown = false, spaceDown = false, altDown = false, metaDown = false, mouseLeftDown = false, mouseMidDown = false, mouseRightDown = false, mouseX = 0, mouseY = 0) {
        Object.defineProperty(this, "key", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timestamp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ctrlDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shiftDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "spaceDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "altDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metaDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mouseLeftDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mouseMidDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mouseRightDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mouseX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mouseY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.key = key;
        this.type = type;
        this.timestamp = timestamp;
        this.ctrlDown = ctrlDown;
        this.shiftDown = shiftDown;
        this.spaceDown = spaceDown;
        this.altDown = altDown;
        this.metaDown = metaDown;
        this.mouseLeftDown = mouseLeftDown;
        this.mouseMidDown = mouseMidDown;
        this.mouseRightDown = mouseRightDown;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }
    clone() {
        return new QueuedEvent(this.key, this.type, this.timestamp, this.ctrlDown, this.shiftDown, this.spaceDown, this.altDown, this.metaDown, this.mouseLeftDown, this.mouseMidDown, this.mouseRightDown, this.mouseX, this.mouseY);
    }
}
