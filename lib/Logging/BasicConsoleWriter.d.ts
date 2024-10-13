import { Writer } from "./Writer";
export declare class BasicConsoleWriter implements Writer {
    private name;
    constructor(name: string);
    debug(message: any[]): void;
    info(message: any[]): void;
    success(message: any[]): void;
    warn(message: any[]): void;
    error(message: any[]): void;
    critical(message: any[]): void;
}
