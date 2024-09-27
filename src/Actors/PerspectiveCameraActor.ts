import { Actor } from "../Scene/Actor";
import * as Three from "three";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ResizeEvent } from "../Core/Resize";
import { ELYSIA_LOGGER } from "../Core/Logger";

export class PerspectiveCameraActor extends Actor<Three.PerspectiveCamera>
{

	get fov() { return this.object3d.fov; }
	set fov(fov: number)
	{
		this.object3d.fov = fov;
		this.object3d.updateProjectionMatrix();
	}

	get aspect() { return this.object3d.aspect; }
	set aspect(aspect: number)
	{
		this.object3d.aspect = aspect;
		this.object3d.updateProjectionMatrix();
	}

	get near() { return this.object3d.near; }
	set near(near: number) { this.object3d.near = near; }

	get far() { return this.object3d.far; }
	set far(far: number) { this.object3d.far = far; }

	get zoom() { return this.object3d.zoom; }
	set zoom(zoom: number) { this.object3d.zoom = zoom; }

	get focus() { return this.object3d.focus; }
	set focus(focus: number) { this.object3d.focus = focus; }

	get filmGauge() { return this.object3d.filmGauge; }
	set filmGauge(filmGauge: number) { this.object3d.filmGauge = filmGauge; }

	get filmOffset() { return this.object3d.filmOffset; }
	set filmOffset(filmOffset: number) { this.object3d.filmOffset = filmOffset; }

	get view() { return this.object3d.view; }
	set view(view: any) { this.object3d.view = view; }

	get debug() { return this.#debug; }
	set debug(value: boolean)
	{
		this.#debug = value;
		if(value)
		{
			this.#debugHelper ??= new Three.CameraHelper(this.object3d);
			this.object3d.add(this.#debugHelper);
		}
		else
		{
			this.#debugHelper?.parent?.remove(this.#debugHelper);
			this.#debugHelper?.dispose();
			this.#debugHelper = undefined;
		}
	}

	constructor()
	{
		super();
		this.onResize = this.onResize.bind(this);
		this.object3d = new Three.PerspectiveCamera();
		this.object3d.actor = this;
	}

	onCreate()
	{
		ElysiaEventDispatcher.addEventListener(ResizeEvent, this.onResize);
		this.onResize({
			x: this.app?.renderPipeline.getRenderer().domElement.width ?? 0,
			y: this.app?.renderPipeline.getRenderer().domElement.height ?? 0
		});
	}

	private onResize(e: { x: number, y: number })
	{
		this.object3d.aspect = e.x / e.y;
		this.object3d.updateProjectionMatrix();
	}

	#debug = false;
	#debugHelper?: Three.CameraHelper;
}

