import { createLogger, LogLevel } from "../Logging/Logger.js";
export const ELYSIA_LOGGER = createLogger({
    level: LogLevel.Silent,
    name: "ELYSIA"
});
globalThis.SET_ELYSIA_LOGLEVEL = (level) => {
    ELYSIA_LOGGER.level = level;
};
