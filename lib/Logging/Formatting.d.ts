import { Gradient, RGB } from "./Gradients";
export declare function interpolateRGB(startColor: RGB, endColor: RGB, t: number): RGB;
export declare function formatAnsi(string: string, styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    foreground?: RGB;
    background?: RGB;
}): {
    content: string;
    styles: never[];
};
export declare function format(string: string, options?: {}): {
    content: string;
    styles: string[];
};
export declare function stringGradient(str: string, gradient: Gradient, options?: {}): {
    content: string;
    styles: string[];
};
