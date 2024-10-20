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
    name;
    level;
    writer;
    constructor(name, level, writer) {
        this.name = name;
        this.level = level;
        this.writer = writer;
    }
    /**
     * Log a message for debugging purposes.
     * @param  {...any} msg
     * @returns void
     */
    debug = (...msg) => {
        // @ts-ignore
        if (globalThis.__LOG_FILTERS !== null) {
            // @ts-ignore
            if (!globalThis.__LOG_FILTERS.includes(this.name))
                return;
        }
        this.level <= LogLevel.Debug && this.writer.debug(msg);
    };
    /**
     * Log a message that provides non critical information for the user.
     * @param  {...any} msg
     * @returns void
     */
    info = (...msg) => {
        // @ts-ignore
        if (globalThis.__LOG_FILTERS !== null) {
            // @ts-ignore
            if (!globalThis.__LOG_FILTERS.includes(this.name))
                return;
        }
        this.level <= LogLevel.Info && this.writer.info(msg);
    };
    /**
     * Log a message that indicates a successful operation to the user.
     * @param  {...any} msg
     * @returns void
     */
    success = (...msg) => {
        // @ts-ignore
        if (globalThis.__LOG_FILTERS !== null) {
            // @ts-ignore
            if (!globalThis.__LOG_FILTERS.includes(this.name))
                return;
        }
        this.level <= LogLevel.Info && this.writer.success(msg);
    };
    /**
     * Log a message that indicates a warning to the user.
     * @param  {...any} msg
     * @returns void
     */
    warn = (...msg) => {
        // @ts-ignore
        if (globalThis.__LOG_FILTERS !== null) {
            // @ts-ignore
            if (!globalThis.__LOG_FILTERS.includes(this.name))
                return;
        }
        this.level <= LogLevel.Warn && this.writer.warn(msg);
    };
    /**
     * Log a message that indicates an error to the user.
     * @param  {...any} msg
     * @returns void
     */
    error = (...msg) => {
        // @ts-ignore
        if (globalThis.__LOG_FILTERS !== null) {
            // @ts-ignore
            if (!globalThis.__LOG_FILTERS.includes(this.name))
                return;
        }
        this.level <= LogLevel.Error && this.writer.error(msg);
    };
    /**
     * Log a message that indicates a critical error to the user.
     * @param  {...any} msg
     * @returns void
     */
    critical = (...msg) => {
        // @ts-ignore
        if (globalThis.__LOG_FILTERS !== null) {
            // @ts-ignore
            if (!globalThis.__LOG_FILTERS.includes(this.name))
                return;
        }
        this.level <= LogLevel.Critical && this.writer.critical(msg);
    };
}
function createLogger(config = {}) {
    const level = config.level ?? LogLevel.Info;
    const color = config.color ?? gradients.sunset;
    const writer = config.writer ?? (isColorSupported() ? new FancyConsoleWriter(config.name ?? "App", color) : new BasicConsoleWriter(config.name ?? "App"));
    return new Logger(config.name ?? "App", level, writer);
}
