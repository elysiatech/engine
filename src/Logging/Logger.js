import { gradients } from "./Gradients";
import { isColorSupported } from "../Core/Platform";
import { LogLevel } from "./Levels";
import { BasicConsoleWriter } from "./BasicConsoleWriter";
import { FancyConsoleWriter } from "./FancyConsoleWriter";
export { LogLevel } from "./Levels";
export { Logger, createLogger };
class Logger {
    level;
    writer;
    constructor(level, writer) {
        this.level = level;
        this.writer = writer;
    }
    /**
     * Log a message for debugging purposes.
     * @param  {...any} msg
     * @returns void
     */
    debug = (...msg) => {
        console.log(this.level <= LogLevel.Debug);
        this.level <= LogLevel.Debug && this.writer.debug(msg);
    };
    /**
     * Log a message that provides non critical information for the user.
     * @param  {...any} msg
     * @returns void
     */
    info = (...msg) => this.level <= LogLevel.Info && this.writer.info(msg);
    /**
     * Log a message that indicates a successful operation to the user.
     * @param  {...any} msg
     * @returns void
     */
    success = (...msg) => this.level <= LogLevel.Info && this.writer.success(msg);
    /**
     * Log a message that indicates a warning to the user.
     * @param  {...any} msg
     * @returns void
     */
    warn = (...msg) => this.level <= LogLevel.Warn && this.writer.warn(msg);
    /**
     * Log a message that indicates an error to the user.
     * @param  {...any} msg
     * @returns void
     */
    error = (...msg) => this.level <= LogLevel.Error && this.writer.error(msg);
    /**
     * Log a message that indicates a critical error to the user.
     * @param  {...any} msg
     * @returns void
     */
    critical = (...msg) => this.level <= LogLevel.Critical && this.writer.critical(msg);
}
function createLogger(config = {}) {
    const level = config.level ?? LogLevel.Info;
    const color = config.color ?? gradients.sunset;
    const writer = config.writer ?? (isColorSupported() ? new FancyConsoleWriter(config.name ?? "App", color) : new BasicConsoleWriter(config.name ?? "App"));
    return new Logger(level, writer);
}
