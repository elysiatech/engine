import * as Three from "three";
import Rapier from "@dimforge/rapier3d-compat";
import { Behavior } from "../Scene/Behavior";

export abstract class RapierColliderBehavior extends Behavior
{
	override type = "RapierColliderBehavior";

	constructor() {
		super();
		this.addTag(RapierColliderBehavior)
	}
}