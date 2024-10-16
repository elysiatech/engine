import { Text } from 'troika-three-text';
import { Actor } from "../Scene/Actor.ts";
export type TextActorConstructorArguments = {
    text: string;
    color?: number | string;
    fontSize?: number;
    maxWidth?: number;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    font?: string;
    anchorX?: number | 'left' | 'center' | 'right';
    anchorY?: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom';
    clipRect?: [number, number, number, number];
    depthOffset?: number;
    direction?: 'auto' | 'ltr' | 'rtl';
    overflowWrap?: 'normal' | 'break-word';
    whiteSpace?: 'normal' | 'overflowWrap' | 'nowrap';
    outlineWidth?: number | string;
    outlineOffsetX?: number | string;
    outlineOffsetY?: number | string;
    outlineBlur?: number | string;
    outlineColor?: number | string;
    outlineOpacity?: number;
    strokeWidth?: number | string;
    strokeColor?: number | string;
    strokeOpacity?: number;
    fillOpacity?: number;
    sdfGlyphSize?: number;
    debugSDF?: boolean;
};
export declare class TextActor extends Actor<Text> {
    get text(): any;
    set text(val: any);
    get color(): any;
    set color(val: any);
    get fontSize(): any;
    set fontSize(val: any);
    get maxWidth(): any;
    set maxWidth(val: any);
    get lineHeight(): any;
    set lineHeight(val: any);
    get letterSpacing(): any;
    set letterSpacing(val: any);
    get textAlign(): any;
    set textAlign(val: any);
    get font(): any;
    set font(val: any);
    get anchorX(): any;
    set anchorX(val: any);
    get anchorY(): any;
    set anchorY(val: any);
    get clipRect(): any;
    set clipRect(val: any);
    get depthOffset(): any;
    set depthOffset(val: any);
    get direction(): any;
    set direction(val: any);
    get overflowWrap(): any;
    set overflowWrap(val: any);
    get whiteSpace(): any;
    set whiteSpace(val: any);
    get outlineWidth(): any;
    set outlineWidth(val: any);
    get outlineOffsetX(): any;
    set outlineOffsetX(val: any);
    get outlineOffsetY(): any;
    set outlineOffsetY(val: any);
    get outlineBlur(): any;
    set outlineBlur(val: any);
    get outlineColor(): any;
    set outlineColor(val: any);
    get outlineOpacity(): any;
    set outlineOpacity(val: any);
    get strokeWidth(): any;
    set strokeWidth(val: any);
    get strokeColor(): any;
    set strokeColor(val: any);
    get strokeOpacity(): any;
    set strokeOpacity(val: any);
    get fillOpacity(): any;
    set fillOpacity(val: any);
    get sdfGlyphSize(): any;
    set sdfGlyphSize(val: any);
    get debugSDF(): any;
    set debugSDF(val: any);
    loaded: boolean;
    constructor(props: TextActorConstructorArguments);
}
