import { ELYSIA_LOGGER } from "./Logger.ts";
import { isDev } from "./Asserts.ts";

export function reportLifecycleError(value: any, { kind, name })
{
	if(!isDev()) return value;
	if (kind === "method") {
		return function (...args) {
			let ret;
			try { ret = value.call(this, ...args); }
			catch (err)
			{
				ELYSIA_LOGGER.error(`Error in ${String(name)} method of`, this.constructor.name, err, this);
			}
			return ret;
		};
	}
}