import { LogLevel } from "../Logging/Logger.ts";
export declare const ELYSIA_LOGGER: import("../Logging/Logger.ts").Logger;
declare global {
    var SET_ELYSIA_LOGLEVEL: (level: LogLevel) => void;
}
