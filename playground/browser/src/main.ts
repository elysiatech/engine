import { createLogger } from "../../../src/Logging/Logger";
import { LogLevel } from "../../../src/Logging/Levels.ts";

const logger = createLogger({
	level: LogLevel.Debug
})

console.log(logger)

logger.debug("Debug message");
logger.info("Info message");
logger.success("Success message");
logger.warn("Warn message");
logger.error("Error message");
logger.critical("Critical message");