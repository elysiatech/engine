import { hasTTY } from "./Asserts";

const toBoolean = (val: any) => val ? val !== "false" : false;

export function env(): any {
	return globalThis.process?.env ||
	// @ts-ignore
	import.meta.env ||
	// @ts-ignore
	globalThis.Deno?.env.toObject() ||
	// @ts-ignore
	globalThis.__env__ ||
	globalThis;
}

export function isWindows() {
	return /^win/i.test(globalThis.process?.platform || "")
}

export function isColorSupported() {
	return typeof document !== "undefined" || (!toBoolean(env().NO_COLOR) && (toBoolean(env().FORCE_COLOR) || ((hasTTY() || isWindows()) && env().TERM !== "dumb")))
}