import { createLogger, LogLevel } from "../Logging/Logger.ts";

export const ELYSIA_LOGGER = createLogger({
	level: LogLevel.Silent,
	name: "ELYSIA"
});

declare global
{
	var SET_ELYSIA_LOGLEVEL: (level: LogLevel) => void;
}

globalThis.SET_ELYSIA_LOGLEVEL = (level: LogLevel) =>
{
	ELYSIA_LOGGER.level = level;
}