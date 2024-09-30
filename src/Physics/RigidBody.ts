import { Behavior } from "../Scene/Behavior";
import Rapier from "@dimforge/rapier3d-compat"

export class RigidBodyBehavior extends Behavior
{
	override type = "RapierRigidBodyBehavior";

	constructor(args: { type: Rapier.RigidBodyType })
	{
		super();
		this.#type = args.type ?? "dynamic";

		this.desc = new Rapier.RigidBodyDesc(this.#type);
	}

	#type: Rapier.RigidBodyType;
	desc: Rapier.RigidBodyDesc;
}
