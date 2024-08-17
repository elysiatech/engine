import * as Three from "three";
import { MeshActor } from "./MeshActor";

export class SkeletalMeshActor extends MeshActor<Three.SkinnedMesh> {
	override object3d = new Three.SkinnedMesh();
}
