import { KeyCode } from "./KeyCode";
export class QueuedEvent {
    key;
    type;
    timestamp;
    ctrlDown;
    shiftDown;
    spaceDown;
    altDown;
    metaDown;
    mouseLeftDown;
    mouseMidDown;
    mouseRightDown;
    mouseX;
    mouseY;
    constructor(key = KeyCode.None, type = "down", timestamp = performance.now(), ctrlDown = false, shiftDown = false, spaceDown = false, altDown = false, metaDown = false, mouseLeftDown = false, mouseMidDown = false, mouseRightDown = false, mouseX = 0, mouseY = 0) {
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
