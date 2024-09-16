import { KeyCode } from "./KeyCode";

export class QueuedEvent {
	key: KeyCode;
	timestamp: number;
	ctrlDown: boolean;
	shiftDown: boolean;
	spaceDown: boolean;
	altDown: boolean;
	metaDown: boolean;
	mouseLeftDown: boolean;
	mouseMidDown: boolean;
	mouseRightDown: boolean;
	mouseX: number;
	mouseY: number;

	constructor(
		key: KeyCode = KeyCode.None,
		timestamp: number = performance.now(),
		ctrlDown: boolean = false,
		shiftDown: boolean = false,
		spaceDown: boolean = false,
		altDown: boolean = false,
		metaDown: boolean = false,
		mouseLeftDown: boolean = false,
		mouseMidDown: boolean = false,
		mouseRightDown: boolean = false,
		mouseX: number = 0,
		mouseY: number = 0,
	) {
		this.key = key;
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

}
