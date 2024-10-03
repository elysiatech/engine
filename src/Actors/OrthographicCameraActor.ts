import { Actor } from "../Scene/Actor";
import * as Three from "three";
import { ElysiaEventDispatcher } from "../Events/EventDispatcher";
import { ResizeEvent } from "../Core/Resize";

export class OrthographicCameraActor extends Actor<Three.OrthographicCamera>
{
	override type = "OrthographicCameraActor";

	set left(value: number) { this.object3d.left = value; }
	get left() { return this.object3d.left; }

	set right(value: number) { this.object3d.right = value; }
	get right() { return this.object3d.right; }

	set top(value: number) { this.object3d.top = value; }
	get top() { return this.object3d.top; }

	set bottom(value: number) { this.object3d.bottom = value; }
	get bottom() { return this.object3d.bottom; }

	set near(value: number) { this.object3d.near = value; }
	get near() { return this.object3d.near; }

	set far(value: number) { this.object3d.far = value; }
	get far() { return this.object3d.far; }

	get zoom() { return this.object3d.zoom; }
	set zoom(value: number) { this.object3d.zoom = value; }

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

	constructor() {
		super();
		this.object3d = new Three.OrthographicCamera();
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
		const aspect = e.x / e.y;
		this.object3d.left = -1 * aspect;
		this.object3d.right = 1 * aspect;
		this.object3d.top = 1;
		this.object3d.bottom = -1;
		this.object3d.updateProjectionMatrix();
	}

	#debug = false;
	#debugHelper?: Three.CameraHelper;
}