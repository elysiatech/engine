import { format, stringGradient } from "./Formatting";
import { gradients } from "./Gradients";
import { isColorSupported } from "./Platform";
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Debug"] = 100] = "Debug";
    LogLevel[LogLevel["Success"] = 200] = "Success";
    LogLevel[LogLevel["Info"] = 250] = "Info";
    LogLevel[LogLevel["Warn"] = 300] = "Warn";
    LogLevel[LogLevel["Error"] = 400] = "Error";
    LogLevel[LogLevel["Critical"] = 500] = "Critical";
    LogLevel[LogLevel["Production"] = 999] = "Production";
    LogLevel[LogLevel["Silent"] = 9999] = "Silent";
})(LogLevel || (LogLevel = {}));
export class FancyConsoleWriter {
    name;
    formattedName;
    levels;
    constructor(name, color) {
        this.name = name;
        this.formattedName = stringGradient(`[ ${name} ]`, color);
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
    write(level, message) {
        if (level === LogLevel.Debug)
            return this.writeDebug(message);
        if (level === LogLevel.Info)
            return this.writeInfo(message);
        if (level === LogLevel.Success)
            return this.writeSuccess(message);
        if (level === LogLevel.Warn)
            return this.writeWarn(message);
        if (level === LogLevel.Error)
            return this.writeError(message);
        if (level === LogLevel.Critical)
            return this.writeCritical(message);
        console.log(this.formattedName.content, ...this.formattedName.styles, ...message);
    }
    writeDebug(message) {
        console.log(`${this.formattedName.content} ${this.levels.debug.content}`, ...this.formattedName.styles, ...this.levels.debug.styles, ...message);
    }
    writeInfo(message) {
        console.log(`${this.formattedName.content} ${this.levels.info.content}`, ...this.formattedName.styles, ...this.levels.info.styles, ...message);
    }
    writeSuccess(message) {
        console.log(`${this.formattedName.content} ${this.levels.success.content}`, ...this.formattedName.styles, ...this.levels.success.styles, ...message);
    }
    writeWarn(message) {
        console.log(`${this.formattedName.content} ${this.levels.warn.content}`, ...this.formattedName.styles, ...this.levels.warn.styles, ...message);
    }
    writeError(message) {
        console.log(`${this.formattedName.content} ${this.levels.error.content}`, ...this.formattedName.styles, ...this.levels.error.styles, ...message);
    }
    writeCritical(message) {
        console.log(`${this.formattedName.content} ${this.levels.critical.content}`, ...this.formattedName.styles, ...this.levels.critical.styles, ...message);
    }
}
export class SimpleConsoleWriter {
    name;
    constructor(name) {
        this.name = name;
    }
    write(level, message) {
        if (level === LogLevel.Debug)
            return this.writeDebug(message);
        if (level === LogLevel.Info)
            return this.writeInfo(message);
        if (level === LogLevel.Success)
            return this.writeSuccess(message);
        if (level === LogLevel.Warn)
            return this.writeWarn(message);
        if (level === LogLevel.Error)
            return this.writeError(message);
        if (level === LogLevel.Critical)
            return this.writeCritical(message);
        console.log(`[${this.name}]`, ...message);
    }
    writeDebug(message) {
        console.debug(`[${this.name}]`, ...message);
    }
    writeInfo(message) {
        console.info(`[${this.name}]`, ...message);
    }
    writeSuccess(message) {
        console.log(`[${this.name}] SUCCESS`, ...message);
    }
    writeWarn(message) {
        console.warn(`[${this.name}] WARN`, ...message);
    }
    writeError(message) {
        console.error(`[${this.name}] ERROR`, ...message);
    }
    writeCritical(message) {
        console.error(`[${this.name}] CRITICAL`, ...message);
    }
}
export class Logger {
    level;
    writer;
    constructor(level, writer) {
        this.level = level;
        this.writer = writer;
    }
    logImpl(level, input) {
        if (level > LogLevel.Production || level < this.level)
            return;
        this.writer?.write(level, input);
    }
    /**
     * Log a message for debugging purposes.
     * @param  {...any} msg
     * @returns void
     */
    debug = (...msg) => this.logImpl(LogLevel.Debug, msg);
    /**
     * Log a message that provides non critical information for the user.
     * @param  {...any} msg
     * @returns void
     */
    info = (...msg) => this.logImpl(LogLevel.Info, msg);
    /**
     * Log a message that indicates a successful operation to the user.
     * @param  {...any} msg
     * @returns void
     */
    success = (...msg) => this.logImpl(LogLevel.Success, msg);
    /**
     * Log a message that indicates a warning to the user.
     * @param  {...any} msg
     * @returns void
     */
    warn = (...msg) => this.logImpl(LogLevel.Warn, msg);
    /**
     * Log a message that indicates an error to the user.
     * @param  {...any} msg
     * @returns void
     */
    error = (...msg) => this.logImpl(LogLevel.Error, msg);
    /**
     * Log a message that indicates a critical error to the user.
     * @param  {...any} msg
     * @returns void
     */
    critical = (...msg) => this.logImpl(LogLevel.Critical, msg);
    log = (...msg) => this.logImpl(LogLevel.Production, msg);
}
export function createLogger(name, config = {}) {
    if (!name)
        throw new Error("Logger must have a name");
    const level = config.level ?? LogLevel.Info;
    const color = config.color ?? gradients.orange;
    const writer = config.writer ?? (isColorSupported ? new FancyConsoleWriter(name, color) : new SimpleConsoleWriter(name));
    return new Logger(level, writer);
}
