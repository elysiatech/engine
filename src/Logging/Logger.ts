import { gradients, RGB } from "./Gradients";
import { isColorSupported } from "../Core/Platform";
import { LogLevel } from "./Levels";
import { Writer } from "./Writer";
import { BasicConsoleWriter } from "./BasicConsoleWriter";
import { FancyConsoleWriter } from "./FancyConsoleWriter";

export { LogLevel } from "./Levels";
export { Logger, type LogConfig, createLogger };

class Logger {
	constructor(
		public level: LogLevel,
		public writer: Writer,
	) {}

	/**
	 * Log a message for debugging purposes.
	 * @param  {...any} msg
	 * @returns void
	 */
	debug = (...msg: any[]) => {
		console.log(this.level <= LogLevel.Debug)
		this.level <= LogLevel.Debug && this.writer.debug(msg);

	}
	/**
	 * Log a message that provides non critical information for the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	info = (...msg: any[]) => this.level <= LogLevel.Info && this.writer.info(msg);
	/**
	 * Log a message that indicates a successful operation to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	success = (...msg: any[]) => this.level <= LogLevel.Info && this.writer.success(msg);
	/**
	 * Log a message that indicates a warning to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	warn = (...msg: any[]) => this.level <= LogLevel.Warn && this.writer.warn(msg);
	/**
	 * Log a message that indicates an error to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	error = (...msg: any[]) => this.level <= LogLevel.Error && this.writer.error(msg);
	/**
	 * Log a message that indicates a critical error to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	critical = (...msg: any[]) => this.level <= LogLevel.Critical && this.writer.critical(msg);
	/**
	 * Log a message that indicates a group of messages.
	 * @param  {Array<any>} messages
	 * @returns void
	 */
}

type LogConfig = {
	name?: string;
	level?: Logger["level"];
	color?: [RGB, RGB];
	writer?: Logger["writer"];
};

function createLogger(config: LogConfig = {}) {
	const level = config.level ?? LogLevel.Info;
	const color = config.color ?? gradients.sunset;
	const writer = config.writer ?? (isColorSupported() ? new FancyConsoleWriter(config.name ?? "App", color) : new BasicConsoleWriter(config.name ?? "App"));
	return new Logger(level, writer);
}
