import { Application } from "../../../src/Core/Application";
import { Scene } from "../../../src/Scene/Scene";
import { Actor } from "../../../src/Scene/Actor";
import * as Three from "three";
import { ActiveCameraTag } from "../../../src/Core/Tags.ts";

const app = new Application();

const scene = new Scene();

const cameraActor = new Actor();
cameraActor.object3d = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraActor.object3d.position.z = 5;
cameraActor.addTag(ActiveCameraTag);
scene.addComponent(cameraActor);

const cube = new Actor();
cube.object3d = new Three.Mesh(
	new Three.BoxGeometry(),
	new Three.MeshBasicMaterial({ color: 0x00ff00 }),
);
scene.addComponent(cube);


app.loadScene(scene);
