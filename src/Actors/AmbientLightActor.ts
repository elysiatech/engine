import { Actor } from "../Scene/Actor";
import * as Three from "three";

export class AmbientLightActor extends Actor<Three.AmbientLight>
{
	get intensity() { return this.object3d.intensity; }
	set intensity(value: number) { this.object3d.intensity = value; }

	get color() { return this.object3d.color; }
	set color(value: Three.Color) { this.object3d.color = value; }

	get castShadow() { return this.object3d.castShadow; }
	set castShadow(value: boolean) { this.object3d.castShadow = value; }

	constructor(intensity?: number, color?: Three.Color)
	{
		super();
		this.object3d = new Three.AmbientLight(color, intensity);
		this.object3d.actor = this;
	}
}