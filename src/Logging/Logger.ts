import { gradients, RGB } from "./Gradients.ts";
import { isColorSupported } from "../Core/Platform.ts";
import { LogLevel } from "./Levels.ts";
import { Writer } from "./Writer.ts";
import { BasicConsoleWriter } from "./BasicConsoleWriter.ts";
import { FancyConsoleWriter } from "./FancyConsoleWriter.ts";

export { LogLevel } from "./Levels.ts";
export { Logger, type LogConfig, createLogger };

declare global
{
	var FILTER_LOGS: (...args: any[]) => void;
}

// @ts-ignore
globalThis.__LOG_FILTERS = null;

globalThis.FILTER_LOGS = (...args: any[]) =>
{
	if(args.length === 0 || args[0] === null || !args[0]) {
		// @ts-ignore
		globalThis.__LOG_FILTERS = null;
	}
	else {
		// @ts-ignore
		globalThis.__LOG_FILTERS = args;
	}
}

class Logger
{
	constructor(
		public readonly name: string,
		public level: LogLevel,
		public writer: Writer,
	) {}

	/**
	 * Log a message for debugging purposes.
	 * @param  {...any} msg
	 * @returns void
	 */
	debug = (...msg: any[]) =>
	{
		// @ts-ignore
		if(globalThis.__LOG_FILTERS !== null)
		{
			// @ts-ignore
			if(!globalThis.__LOG_FILTERS.includes(this.name)) return;
		}
		this.level <= LogLevel.Debug && this.writer.debug(msg);
	}
	/**
	 * Log a message that provides non critical information for the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	info = (...msg: any[]) =>
	{
		// @ts-ignore
		if(globalThis.__LOG_FILTERS !== null)
		{
			// @ts-ignore
			if(!globalThis.__LOG_FILTERS.includes(this.name)) return
		}
		this.level <= LogLevel.Info && this.writer.info(msg);
	}
	/**
	 * Log a message that indicates a successful operation to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	success = (...msg: any[]) =>
	{
		// @ts-ignore
		if(globalThis.__LOG_FILTERS !== null)
		{
			// @ts-ignore
			if(!globalThis.__LOG_FILTERS.includes(this.name)) return;
		}
		this.level <= LogLevel.Info && this.writer.success(msg);
	}
	/**
	 * Log a message that indicates a warning to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	warn = (...msg: any[]) =>
	{
		// @ts-ignore
		if(globalThis.__LOG_FILTERS !== null)
		{
			// @ts-ignore
			if(!globalThis.__LOG_FILTERS.includes(this.name)) return;
		}
		this.level <= LogLevel.Warn && this.writer.warn(msg);
	}
	/**
	 * Log a message that indicates an error to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	error = (...msg: any[]) =>
	{
		// @ts-ignore
		if(globalThis.__LOG_FILTERS !== null)
		{
			// @ts-ignore
			if(!globalThis.__LOG_FILTERS.includes(this.name)) return;
		}
		this.level <= LogLevel.Error && this.writer.error(msg);
	}
	/**
	 * Log a message that indicates a critical error to the user.
	 * @param  {...any} msg
	 * @returns void
	 */
	critical = (...msg: any[]) =>
	{
		// @ts-ignore
		if(globalThis.__LOG_FILTERS !== null)
		{
			// @ts-ignore
			if(!globalThis.__LOG_FILTERS.includes(this.name)) return;
		}
		this.level <= LogLevel.Critical && this.writer.critical(msg);
	}
}

type LogConfig = {
	name?: string;
	level?: Logger["level"];
	color?: [RGB, RGB];
	writer?: Logger["writer"];
};

function createLogger(config: LogConfig = {})
{
	const level = config.level ?? LogLevel.Info;
	const color = config.color ?? gradients.sunset;
	const writer = config.writer ?? (isColorSupported() ? new FancyConsoleWriter(config.name ?? "App", color) : new BasicConsoleWriter(config.name ?? "App"));
	return new Logger(config.name ?? "App", level, writer);
}
