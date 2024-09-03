import { format, stringGradient } from "./Formatting";
import { gradients, RGB } from "./Gradients";
import { isColorSupported } from "./Platform";

export enum LogLevel {
	Debug = 100,
	Success = 200,
	Info = 250,
	Warn = 300,
	Error = 400,
	Critical = 500,
	Production = 999,
	Silent = 9999,
}

export interface LogWriter {
	write(level: LogLevel, message: any[]): void;
}

export class FancyConsoleWriter implements LogWriter {
	name: string;

	formattedName: { content: string; styles: string[] };

	levels: Record<string, { content: string; styles: string[] }>;

	constructor(name: string, color: [RGB, RGB]) {
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

	write(level: LogLevel, message: any[]) {
		if (level === LogLevel.Debug) return this.writeDebug(message);
		if (level === LogLevel.Info) return this.writeInfo(message);
		if (level === LogLevel.Success) return this.writeSuccess(message);
		if (level === LogLevel.Warn) return this.writeWarn(message);
		if (level === LogLevel.Error) return this.writeError(message);
		if (level === LogLevel.Critical) return this.writeCritical(message);

		console.log(
			this.formattedName.content,
			...this.formattedName.styles,
			...message,
		);
	}

	writeDebug(message: any[]): void {
		console.log(
			`${this.formattedName.content} ${this.levels.debug.content}`,
			...this.formattedName.styles,
			...this.levels.debug.styles,
			...message,
		);
	}

	writeInfo(message: any[]): void {
		console.log(
			`${this.formattedName.content} ${this.levels.info.content}`,
			...this.formattedName.styles,
			...this.levels.info.styles,
			...message,
		);
	}

	writeSuccess(message: any[]): void {
		console.log(
			`${this.formattedName.content} ${this.levels.success.content}`,
			...this.formattedName.styles,
			...this.levels.success.styles,
			...message,
		);
	}

	writeWarn(message: any[]): void {
		console.log(
			`${this.formattedName.content} ${this.levels.warn.content}`,
			...this.formattedName.styles,
			...this.levels.warn.styles,
			...message,
		);
	}

	writeError(message: any[]): void {
		console.log(
			`${this.formattedName.content} ${this.levels.error.content}`,
			...this.formattedName.styles,
			...this.levels.error.styles,
			...message,
		);
	}

	writeCritical(message: any[]): void {
		console.log(
			`${this.formattedName.content} ${this.levels.critical.content}`,
			...this.formattedName.styles,
			...this.levels.critical.styles,
			...message,
		);
	}
}

export class SimpleConsoleWriter implements LogWriter {
	constructor(private name: string) {}

	write(level: LogLevel, message: any[]) {
		if (level === LogLevel.Debug) return this.writeDebug(message);
		if (level === LogLevel.Info) return this.writeInfo(message);
		if (level === LogLevel.Success) return this.writeSuccess(message);
		if (level === LogLevel.Warn) return this.writeWarn(message);
		if (level === LogLevel.Error) return this.writeError(message);
		if (level === LogLevel.Critical) return this.writeCritical(message);

		console.log(`[${this.name}]`, ...message);
	}

	writeDebug(message: any[]): void {
		console.debug(`[${this.name}]`, ...message);
	}

	writeInfo(message: any[]): void {
		console.info(`[${this.name}]`, ...message);
	}

	writeSuccess(message: any[]): void {
		console.log(`[${this.name}] SUCCESS`, ...message);
	}

	writeWarn(message: any[]): void {
		console.warn(`[${this.name}] WARN`, ...message);
	}

	writeError(message: any[]): void {
		console.error(`[${this.name}] ERROR`, ...message);
	}

	writeCritical(message: any[]): void {
		console.error(`[${this.name}] CRITICAL`, ...message);
	}
}

export class Logger {
	constructor(
		public level: LogLevel,
		public writer: LogWriter,
	) {}

	logImpl(level: LogLevel, input: any[]) {
		if (level > LogLevel.Production || level < this.level) return;
		this.writer?.write(level, input);
	}
	/**
	 * Log a message for debugging purposes.
	 * @param  {...any} msg
	 * @returns void
	 */
	debug = (...msg: any[]) => this.logImpl(LogLevel.Debug, msg);
	/**
	 * Log a message that provides non critical information for the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	info = (...msg: any[]) => this.logImpl(LogLevel.Info, msg);
	/**
	 * Log a message that indicates a successful operation to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	success = (...msg: any[]) => this.logImpl(LogLevel.Success, msg);
	/**
	 * Log a message that indicates a warning to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	warn = (...msg: any[]) => this.logImpl(LogLevel.Warn, msg);
	/**
	 * Log a message that indicates an error to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	error = (...msg: any[]) => this.logImpl(LogLevel.Error, msg);
	/**
	 * Log a message that indicates a critical error to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	critical = (...msg: any[]) => this.logImpl(LogLevel.Critical, msg);

	log = (...msg: any[]) => this.logImpl(LogLevel.Production, msg);
}

export type LogConfig = {
	level?: Logger["level"];
	color?: [RGB, RGB];
	writer?: Logger["writer"];
};

export function createLogger(name: string, config: LogConfig = {}) {
	if (!name) throw new Error("Logger must have a name");
	const level = config.level ?? LogLevel.Info;
	const color = config.color ?? gradients.orange;
	const writer = config.writer ?? (isColorSupported ? new FancyConsoleWriter(name, color) : new SimpleConsoleWriter(name));
	return new Logger(level, writer);
}
