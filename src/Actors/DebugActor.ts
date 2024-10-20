import { Actor } from "../Scene/Actor.ts";
import * as Three from "three";

/** An actor that renders a debug bounding box and axis for its parent actor. */
export class DebugActor extends Actor
{
	/** Adds a debug helper to an Actor. */
	static Debug(a: Actor)
	{
		const d = new DebugActor;
		a.addComponent(d)
		return d;
	}

	override onEnterScene()
	{
		super.onEnterScene();
		this.object3d.add(this.#debugMesh = new Three.BoxHelper(this.parent!.object3d, 0xffff00));
		this.object3d.add(this.#axis = new Three.AxesHelper(5));
	}

	override onUpdate(delta: number, elapsed: number)
	{
		super.onUpdate(delta, elapsed);
		this.#debugMesh?.update(this.parent!.object3d)
	}

	override onLeaveScene()
	{
		super.onLeaveScene()
		this.#debugMesh?.dispose();
		this.#debugMesh = undefined;
		this.#axis?.dispose();
		this.#axis = undefined;
	}

	#debugMesh?: Three.BoxHelper;
	#axis?: Three.AxesHelper;
}
