import { Behavior } from "../Scene/Behavior";

/**
 * A behavior that makes the parent object always face the camera.
 */
export class BillboardBehavior extends Behavior
{
	override type = 'BillboardBehavior'

	/**
	 * Lock the rotation on the X axis.
	 * @default false
	 */
	get lockX() { return this.#lockX }
	set lockX(value) { this.#lockX = value }

	/**
	 * Lock the rotation on the Y axis.
	 * @default false
	 */
	get lockY() { return this.#lockY }
	set lockY(value) { this.#lockY = value }

	/**
	 * Lock the rotation on the Z axis.
	 * @default false
	 */
	get lockZ() { return this.#lockZ }
	set lockZ(value) { this.#lockZ = value }

	onUpdate(delta: number, elapsed: number)
	{
		if (!this.parent) return

		// save previous rotation in case we're locking an axis
		const prevRotation = this.parent!.object3d.rotation.clone()

		// always face the camera
		this.scene?.getActiveCamera()?.getWorldQuaternion(this.parent.object3d.quaternion)

		// readjust any axis that is locked
		if (this.#lockX) this.parent.object3d.rotation.x = prevRotation.x
		if (this.#lockY) this.parent.object3d.rotation.y = prevRotation.y
		if (this.#lockZ) this.parent.object3d.rotation.z = prevRotation.z
	}

	#lockX = false
	#lockY = false
	#lockZ = false
}