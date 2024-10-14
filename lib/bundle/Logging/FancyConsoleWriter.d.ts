import { RGB } from "./Gradients.ts";
import { Writer } from "./Writer.ts";
export declare class FancyConsoleWriter implements Writer {
    private name;
    formattedName: {
        content: string;
        styles: string[];
    };
    levels: Record<string, {
        content: string;
        styles: string[];
    }>;
    constructor(name: string, color: [RGB, RGB]);
    debug(message: any[]): void;
    info(message: any[]): void;
    success(message: any[]): void;
    warn(message: any[]): void;
    error(message: any[]): void;
    critical(message: any[]): void;
}
