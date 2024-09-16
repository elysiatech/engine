import { gradients } from "../Logger/Gradients";
import { createLogger, LogLevel } from "../Logger/Logger";

export function SET_ELYSIA_LOGGER_LEVEL(level: LogLevel) {
	ELYSIA_LOGGER.level = level;
}

export const ELYSIA_LOGGER = createLogger("ELYSIA", {
	level: LogLevel.Debug,
	color: gradients.purple
})