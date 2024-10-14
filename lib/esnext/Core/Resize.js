import { isBrowser } from "./Asserts.js";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher.js";
import { ElysiaEvent } from "../Events/Event.js";
export class ResizeEvent extends ElysiaEvent {
}
export class ResizeController {
    element;
    width = 0;
    height = 0;
    constructor(element) {
        this.element = element;
        if (!isBrowser())
            return;
        if (element) {
            this.#observer = new ResizeObserver((entries) => {
                const cr = entries[0].contentRect;
                this.width = cr.width;
                this.height = cr.height;
                this.#event.dispatchEvent(new ResizeEvent({ x: this.width, y: this.height }));
            });
            this.#observer.observe(element);
            const bounds = element.getBoundingClientRect();
            this.width = bounds.width;
            this.height = bounds.height;
            window.addEventListener("resize", this.#onResize);
        }
        else {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
        window.addEventListener("resize", this.#onResize);
        this.addEventListener = this.#event.addEventListener.bind(this.#event);
        this.removeEventListener = this.#event.removeEventListener.bind(this.#event);
    }
    addEventListener;
    removeEventListener;
    destructor() {
        window.removeEventListener("resize", this.#onResize);
        this.#observer?.disconnect();
        this.#event.clear();
    }
    #event = new ElysiaEventDispatcher;
    #observer;
    #onResize = (e) => {
        if (this.element) {
            const bounds = this.element.getBoundingClientRect();
            this.width = bounds.width;
            this.height = bounds.height;
            this.#event.dispatchEvent(new ResizeEvent({ x: this.width, y: this.height }));
        }
        else {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.#event.dispatchEvent(new ResizeEvent({ x: this.width, y: this.height }));
        }
    };
}
