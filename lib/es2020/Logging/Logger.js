import { gradients } from "./Gradients.js";
import { isColorSupported } from "../Core/Platform.js";
import { LogLevel } from "./Levels.js";
import { BasicConsoleWriter } from "./BasicConsoleWriter.js";
import { FancyConsoleWriter } from "./FancyConsoleWriter.js";
export { LogLevel } from "./Levels.js";
export { Logger, createLogger };
// @ts-ignore
globalThis.__LOG_FILTERS = null;
globalThis.FILTER_LOGS = (...args) => {
    if (args.length === 0 || args[0] === null || !args[0]) {
        // @ts-ignore
        globalThis.__LOG_FILTERS = null;
    }
    else {
        // @ts-ignore
        globalThis.__LOG_FILTERS = args;
    }
};
class Logger {
    constructor(name, level, writer) {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: name
        });
        Object.defineProperty(this, "level", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: level
        });
        Object.defineProperty(this, "writer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: writer
        });
        /**
         * Log a message for debugging purposes.
         * @param  {...any} msg
         * @returns void
         */
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (...msg) => {
                // @ts-ignore
                if (globalThis.__LOG_FILTERS !== null) {
                    // @ts-ignore
                    if (!globalThis.__LOG_FILTERS.includes(this.name))
                        return;
                }
                this.level <= LogLevel.Debug && this.writer.debug(msg);
            }
        });
        /**
         * Log a message that provides non critical information for the user.
         * @param  {...any} msg
         * @returns void
         */
        Object.defineProperty(this, "info", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (...msg) => {
                // @ts-ignore
                if (globalThis.__LOG_FILTERS !== null) {
                    // @ts-ignore
                    if (!globalThis.__LOG_FILTERS.includes(this.name))
                        return;
                }
                this.level <= LogLevel.Info && this.writer.info(msg);
            }
        });
        /**
         * Log a message that indicates a successful operation to the user.
         * @param  {...any} msg
         * @returns void
         */
        Object.defineProperty(this, "success", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (...msg) => {
                // @ts-ignore
                if (globalThis.__LOG_FILTERS !== null) {
                    // @ts-ignore
                    if (!globalThis.__LOG_FILTERS.includes(this.name))
                        return;
                }
                this.level <= LogLevel.Info && this.writer.success(msg);
            }
        });
        /**
         * Log a message that indicates a warning to the user.
         * @param  {...any} msg
         * @returns void
         */
        Object.defineProperty(this, "warn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (...msg) => {
                // @ts-ignore
                if (globalThis.__LOG_FILTERS !== null) {
                    // @ts-ignore
                    if (!globalThis.__LOG_FILTERS.includes(this.name))
                        return;
                }
                this.level <= LogLevel.Warn && this.writer.warn(msg);
            }
        });
        /**
         * Log a message that indicates an error to the user.
         * @param  {...any} msg
         * @returns void
         */
        Object.defineProperty(this, "error", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (...msg) => {
                // @ts-ignore
                if (globalThis.__LOG_FILTERS !== null) {
                    // @ts-ignore
                    if (!globalThis.__LOG_FILTERS.includes(this.name))
                        return;
                }
                this.level <= LogLevel.Error && this.writer.error(msg);
            }
        });
        /**
         * Log a message that indicates a critical error to the user.
         * @param  {...any} msg
         * @returns void
         */
        Object.defineProperty(this, "critical", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (...msg) => {
                // @ts-ignore
                if (globalThis.__LOG_FILTERS !== null) {
                    // @ts-ignore
                    if (!globalThis.__LOG_FILTERS.includes(this.name))
                        return;
                }
                this.level <= LogLevel.Critical && this.writer.critical(msg);
            }
        });
    }
}
function createLogger(config = {}) {
    const level = config.level ?? LogLevel.Info;
    const color = config.color ?? gradients.sunset;
    const writer = config.writer ?? (isColorSupported() ? new FancyConsoleWriter(config.name ?? "App", color) : new BasicConsoleWriter(config.name ?? "App"));
    return new Logger(config.name ?? "App", level, writer);
}
