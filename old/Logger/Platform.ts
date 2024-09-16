const toBoolean = (val: any) => val ? val !== "false" : false;

const env =
	globalThis.process?.env ||
	// @ts-ignore
	import.meta.env ||
	// @ts-ignore
	globalThis.Deno?.env.toObject() ||
	// @ts-ignore
	globalThis.__env__ ||
	globalThis;

export const hasTTY = toBoolean(
	globalThis.process?.stdout && globalThis.process?.stdout.isTTY,
);

export const isWindows = /^win/i.test(globalThis.process?.platform || "");

export const isCI = toBoolean(env.CI);

export const isColorSupported = typeof document !== "undefined" || (!toBoolean(env.NO_COLOR) && (toBoolean(env.FORCE_COLOR) || ((hasTTY || isWindows) && env.TERM !== "dumb")));
