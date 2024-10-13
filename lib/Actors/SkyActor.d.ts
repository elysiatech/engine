import { Actor } from "../Scene/Actor";
export declare const SkyDirectionalLightTag: unique symbol;
export declare class SkyActor extends Actor {
    #private;
    type: string;
    get turbidity(): number;
    set turbidity(v: number);
    get rayleigh(): number;
    set rayleigh(v: number);
    get mieCoefficient(): number;
    set mieCoefficient(v: number);
    get mieDirectionalG(): number;
    set mieDirectionalG(v: number);
    get elevation(): number;
    set elevation(v: number);
    get azimuth(): number;
    set azimuth(v: number);
    constructor();
    private updateSunPosition;
    onStart(): void;
    private get sky();
    private get material();
}
