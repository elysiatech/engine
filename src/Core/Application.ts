import { LogLevel } from "../Logging/Levels";
import { isDev } from "./Asserts";

export class Application {
	constructor(config: { logLevel?: LogLevel }) {
		SET_ELYSIA_LOGLEVEL(config.logLevel ?? isDev() ? LogLevel.Debug : LogLevel.Production)
	}
}