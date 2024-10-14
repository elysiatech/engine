import { RGB } from "./Gradients.ts";
import { LogLevel } from "./Levels.ts";
import { Writer } from "./Writer.ts";
export { LogLevel } from "./Levels.ts";
export { Logger, type LogConfig, createLogger };
declare global {
    var FILTER_LOGS: (...args: any[]) => void;
}
declare class Logger {
    readonly name: string;
    level: LogLevel;
    writer: Writer;
    constructor(name: string, level: LogLevel, writer: Writer);
    /**
     * Log a message for debugging purposes.
     * @param  {...any} msg
     * @returns void
     */
    debug: (...msg: any[]) => void;
    /**
     * Log a message that provides non critical information for the user.
     * @param  {...any} msg
     * @returns void
     */
    info: (...msg: any[]) => void;
    /**
     * Log a message that indicates a successful operation to the user.
     * @param  {...any} msg
     * @returns void
     */
    success: (...msg: any[]) => void;
    /**
     * Log a message that indicates a warning to the user.
     * @param  {...any} msg
     * @returns void
     */
    warn: (...msg: any[]) => void;
    /**
     * Log a message that indicates an error to the user.
     * @param  {...any} msg
     * @returns void
     */
    error: (...msg: any[]) => void;
    /**
     * Log a message that indicates a critical error to the user.
     * @param  {...any} msg
     * @returns void
     */
    critical: (...msg: any[]) => void;
}
type LogConfig = {
    name?: string;
    level?: Logger["level"];
    color?: [RGB, RGB];
    writer?: Logger["writer"];
};
declare function createLogger(config?: LogConfig): Logger;
