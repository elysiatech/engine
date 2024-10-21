import { gradients } from "./Gradients.js";
import { format, stringGradient } from "./Formatting.js";
export class FancyConsoleWriter {
    constructor(name, color) {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: name
        });
        Object.defineProperty(this, "formattedName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "levels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.formattedName = stringGradient(`[ ${this.name} ]`, color);
        this.levels = {
            debug: stringGradient("DEBUG", gradients.gray, { size: 12 }),
            info: stringGradient("INFO", gradients.blue),
            success: stringGradient("SUCCESS", gradients.lime),
            warn: stringGradient("WARN", gradients.orange),
            error: stringGradient("ERROR", gradients.red, { bold: true }),
            critical: format("  CRITICAL  ", {
                background: [255, 0, 0],
                size: 20,
            }),
        };
    }
    debug(message) {
        console.debug(`${this.formattedName.content} ${this.levels.debug.content}`, ...this.formattedName.styles, ...this.levels.debug.styles, ...message);
    }
    info(message) {
        console.info(`${this.formattedName.content} ${this.levels.info.content}`, ...this.formattedName.styles, ...this.levels.info.styles, ...message);
    }
    success(message) {
        console.log(`${this.formattedName.content} ${this.levels.success.content}`, ...this.formattedName.styles, ...this.levels.success.styles, ...message);
    }
    warn(message) {
        console.warn(`${this.formattedName.content} ${this.levels.warn.content}`, ...this.formattedName.styles, ...this.levels.warn.styles, ...message);
    }
    error(message) {
        console.error(`${this.formattedName.content} ${this.levels.error.content}`, ...this.formattedName.styles, ...this.levels.error.styles, ...message);
    }
    critical(message) {
        console.error(`${this.formattedName.content} ${this.levels.critical.content}`, ...this.formattedName.styles, ...this.levels.critical.styles, ...message);
    }
}
