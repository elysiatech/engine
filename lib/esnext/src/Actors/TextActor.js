// @ts-ignore
import { Text } from 'troika-three-text';
import { OverrideMaterialManager } from 'postprocessing';
import { Actor } from "../Scene/Actor.js";
export class TextActor extends Actor {
    get text() { return this.object3d.text; }
    set text(val) { this.object3d.text = val; this.object3d.sync(); }
    get color() { return this.object3d.color; }
    set color(val) { this.object3d.color = val; this.object3d.sync(); }
    get fontSize() { return this.object3d.fontSize; }
    set fontSize(val) { this.object3d.fontSize = val; this.object3d.sync(); }
    get maxWidth() { return this.object3d.maxWidth; }
    set maxWidth(val) { this.object3d.maxWidth = val; this.object3d.sync(); }
    get lineHeight() { return this.object3d.lineHeight; }
    set lineHeight(val) { this.object3d.lineHeight = val; this.object3d.sync(); }
    get letterSpacing() { return this.object3d.letterSpacing; }
    set letterSpacing(val) { this.object3d.letterSpacing = val; this.object3d.sync(); }
    get textAlign() { return this.object3d.textAlign; }
    set textAlign(val) { this.object3d.textAlign = val; this.object3d.sync(); }
    get font() { return this.object3d.font; }
    set font(val) { this.object3d.font = val; this.object3d.sync(); }
    get anchorX() { return this.object3d.anchorX; }
    set anchorX(val) { this.object3d.anchorX = val; this.object3d.sync(); }
    get anchorY() { return this.object3d.anchorY; }
    set anchorY(val) { this.object3d.anchorY = val; this.object3d.sync(); }
    get clipRect() { return this.object3d.clipRect; }
    set clipRect(val) { this.object3d.clipRect = val; this.object3d.sync(); }
    get depthOffset() { return this.object3d.depthOffset; }
    set depthOffset(val) { this.object3d.depthOffset = val; this.object3d.sync(); }
    get direction() { return this.object3d.direction; }
    set direction(val) { this.object3d.direction = val; this.object3d.sync(); }
    get overflowWrap() { return this.object3d.overflowWrap; }
    set overflowWrap(val) { this.object3d.overflowWrap = val; this.object3d.sync(); }
    get whiteSpace() { return this.object3d.whiteSpace; }
    set whiteSpace(val) { this.object3d.whiteSpace = val; this.object3d.sync(); }
    get outlineWidth() { return this.object3d.outlineWidth; }
    set outlineWidth(val) { this.object3d.outlineWidth = val; this.object3d.sync(); }
    get outlineOffsetX() { return this.object3d.outlineOffsetX; }
    set outlineOffsetX(val) { this.object3d.outlineOffsetX = val; this.object3d.sync(); }
    get outlineOffsetY() { return this.object3d.outlineOffsetY; }
    set outlineOffsetY(val) { this.object3d.outlineOffsetY = val; this.object3d.sync(); }
    get outlineBlur() { return this.object3d.outlineBlur; }
    set outlineBlur(val) { this.object3d.outlineBlur = val; this.object3d.sync(); }
    get outlineColor() { return this.object3d.outlineColor; }
    set outlineColor(val) { this.object3d.outlineColor = val; this.object3d.sync(); }
    get outlineOpacity() { return this.object3d.outlineOpacity; }
    set outlineOpacity(val) { this.object3d.outlineOpacity = val; this.object3d.sync(); }
    get strokeWidth() { return this.object3d.strokeWidth; }
    set strokeWidth(val) { this.object3d.strokeWidth = val; this.object3d.sync(); }
    get strokeColor() { return this.object3d.strokeColor; }
    set strokeColor(val) { this.object3d.strokeColor = val; this.object3d.sync(); }
    get strokeOpacity() { return this.object3d.strokeOpacity; }
    set strokeOpacity(val) { this.object3d.strokeOpacity = val; this.object3d.sync(); }
    get fillOpacity() { return this.object3d.fillOpacity; }
    set fillOpacity(val) { this.object3d.fillOpacity = val; this.object3d.sync(); }
    get sdfGlyphSize() { return this.object3d.sdfGlyphSize; }
    set sdfGlyphSize(val) { this.object3d.sdfGlyphSize = val; this.object3d.sync(); }
    get debugSDF() { return this.object3d.debugSDF; }
    set debugSDF(val) { this.object3d.debugSDF = val; this.object3d.sync(); }
    loaded = false;
    constructor(props) {
        super();
        this.object3d = new Text();
        Object.assign(this.object3d, {
            font: "https://fonts.gstatic.com/s/kodemono/v2/A2BLn5pb0QgtVEPFnlYkkaoBgw4qv9odq5my9Do.ttf",
            sdfGlyphSize: 64,
            anchorX: 'center',
            anchorY: 'middle',
            fontSize: .2,
            ...props
        });
        this.object3d.sync();
        OverrideMaterialManager.workaroundEnabled = true;
    }
}
