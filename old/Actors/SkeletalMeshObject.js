import * as Three from "three";
import { MeshActor } from "./MeshActor";
export class SkeletalMeshActor extends MeshActor {
    object3d = new Three.SkinnedMesh();
}
