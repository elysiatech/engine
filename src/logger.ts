type RGB = [r: number, g: number, b: number];

type Gradient = [start: RGB, end: RGB];

const purpleGradient: Gradient = [
	[247, 81, 172],
	[55, 0, 231],
];
const sunsetGradient: Gradient = [
	[231, 0, 187],
	[255, 244, 20],
];
const grayGradient: Gradient = [
	[235, 244, 245],
	[181, 198, 224],
];
const orangeGradient: Gradient = [
	[255, 147, 15],
	[255, 249, 91],
];
const limeGradient: Gradient = [
	[89, 209, 2],
	[243, 245, 32],
];
const blueGradient: Gradient = [
	[31, 126, 161],
	[111, 247, 232],
];
const redGradient: Gradient = [
	[244, 7, 82],
	[249, 171, 143],
];

const gradients = {
	purple: purpleGradient,
	sunset: sunsetGradient,
	gray: grayGradient,
	orange: orangeGradient,
	lime: limeGradient,
	blue: blueGradient,
	red: redGradient,
} as const;

const lerp = (start: number, end: number, factor: number) =>
	start + factor * (end - start);

export function interpolateRGB(startColor: RGB, endColor: RGB, t: number): RGB {
	if (t < 0) {
		return startColor;
	}
	if (t > 1) {
		return endColor;
	}
	return [
		Math.round(lerp(startColor[0], endColor[0], t)),
		Math.round(lerp(startColor[1], endColor[1], t)),
		Math.round(lerp(startColor[2], endColor[2], t)),
	];
}

function isBrowser() {
	return (
		//@ts-ignore
		typeof window !== "undefined" && typeof globalThis.Deno === "undefined"
	);
}

export function formatAnsi(
	string: string,
	styles: {
		bold?: boolean;
		italic?: boolean;
		underline?: boolean;
		foreground?: RGB;
		background?: RGB;
	} = {},
) {
	let c = "";
	if (styles.bold) c += "1;";
	if (styles.italic) c += "3;";
	if (styles.underline) c += "4;";
	if (styles.foreground) c += `38;2;${styles.foreground.join(";")};`;
	if (styles.background) c += `48;2;${styles.background.join(";")};`;
	while (c.endsWith(";")) c = c.slice(0, -1);
	return {
		content: `\x1b[${c}m${string}\x1b[0m\x1b[0m`,
		styles: [],
	};
}

function formatBrowser(
	string: string,
	options: {
		bold?: boolean;
		italic?: boolean;
		underline?: boolean;
		foreground?: RGB;
		background?: RGB;
		size?: number;
	} = {},
) {
	const styles = [];
	if (options.bold) styles.push("font-weight: bold;");
	if (options.italic) styles.push("font-style: italic;");
	if (options.underline) styles.push("text-decoration: underline;");
	if (options.foreground)
		styles.push(`color: rgb(${options.foreground.join(", ")});`);
	if (options.background)
		styles.push(`background-color: rgb(${options.background.join(", ")});`);
	if (options.size) styles.push(`font-size: ${options.size}px;`);
	return {
		content: `%c${string}`,
		styles: [styles.join("")],
	};
}

export function format(string: string, options = {}) {
	if (isBrowser()) return formatBrowser(string, options);
	return formatAnsi(string, options);
}

export function stringGradient(str: string, gradient: Gradient, options = {}) {
	const result = {
		content: "",
		styles: [] as string[],
	};
	if (isBrowser()) {
		result.content = "%c" + str.split("").join("%c");
		for (let i = 0; i < str.length; i++) {
			const g = interpolateRGB(gradient[0], gradient[1], i / str.length);
			result.styles.push(
				formatBrowser(str[i], { ...options, foreground: g }).styles[0],
			);
		}
		return result;
	}
	for (let i = 0; i < str.length; i++) {
		result.content += formatAnsi(str[i], {
			...options,
			foreground: interpolateRGB(gradient[0], gradient[1], i / str.length),
		}).content;
	}
	return result;
}

function toBoolean(val: any) {
	return val ? val !== "false" : false;
}

const env =
	globalThis.process?.env ||
	// @ts-ignore
	import.meta.env ||
	// @ts-ignore
	globalThis.Deno?.env.toObject() ||
	// @ts-ignore
	globalThis.__env__ ||
	globalThis;

const hasTTY = toBoolean(
	globalThis.process?.stdout && globalThis.process?.stdout.isTTY,
);

const isWindows = /^win/i.test(globalThis.process?.platform || "");

const isCI = toBoolean(env.CI);

const isColorSupported =
	typeof document !== "undefined" ||
	(!toBoolean(env.NO_COLOR) &&
		(toBoolean(env.FORCE_COLOR) ||
			((hasTTY || isWindows) && env.TERM !== "dumb")));

enum LogLevel {
	Debug = 100,
	Success = 200,
	Info = 250,
	Warn = 300,
	Error = 400,
	Critical = 500,
	Production = 999,
	Silent = 9999,
}

interface ConsoleWriter {
	write(level: LogLevel, message: any[]): void;
}

class FancyConsoleWriter implements ConsoleWriter {
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

class SimpleConsoleWriter implements ConsoleWriter {
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

class Logger {
	constructor(
		public level: LogLevel,
		public writer: ConsoleWriter,
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

type LogConfig = {
	level?: Logger["level"];
	color?: [RGB, RGB];
	writer?: Logger["writer"];
};

function createLogger(name: string, config: LogConfig = {}) {
	if (!name) throw new Error("Logger must have a name");
	const level = config.level ?? LogLevel.Info;
	const color = config.color ?? gradients.orange;
	const writer =
		config.writer ??
		(isColorSupported
			? new FancyConsoleWriter(name, color)
			: new SimpleConsoleWriter(name));
	return new Logger(level, writer);
}

export {
	isColorSupported,
	isCI,
	gradients,
	FancyConsoleWriter,
	SimpleConsoleWriter,
	LogLevel,
	Logger,
	createLogger,
};
