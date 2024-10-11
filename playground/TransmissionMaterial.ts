import * as Three from "three";
import { Application } from "../src/Core/ApplicationEntry.ts";
import { Scene } from "../src/Scene/Scene.ts";
import { BasicRenderPipeline } from "../src/RPipeline/BasicRenderPipeline.ts";
import { PerspectiveCameraActor } from "../src/Actors/PerspectiveCameraActor.ts";
import { CameraOrbitBehavior } from "../src/Behaviors/CameraOrbitBehavior.ts";
import { DirectionalLightActor } from "../src/Actors/DirectionalLightActor.ts";
import { EnvironmentActor } from "../src/Actors/EnvironmentActor.ts";
import { Colors } from "../src/Core/Colors.ts";
import { TextActor } from "../src/Actors/TextActor.ts";
import { MeshTransmissionMaterial } from "../src/WebGL/MeshTransmissionMaterial.ts";
import { GLTFAsset } from "../src/Assets/GLTFAsset.ts";
import { MeshActor } from "../src/Actors/MeshActor.ts";
import { FloatBehavior } from "../src/Behaviors/FloatBehavior.ts";

// Create the application.
const app = new Application({
	renderPipeline: new BasicRenderPipeline,
	stats: true,
});

// Create a scene
const scene = new Scene;

const camera = new PerspectiveCameraActor;
camera.position.set(0, 0, 5);
scene.activeCamera = camera;
scene.addComponent(camera);
camera.addComponent(new CameraOrbitBehavior)

const text = new TextActor({ text: "Elysiatech", fontSize: 1 });
text.color = new Three.Color(Colors.Pink);
scene.addComponent(text);

const spring = await new GLTFAsset("/assets/spring.glb").load()

const geo = (spring!.clone().children[0] as Three.Mesh).geometry;

const material = new MeshTransmissionMaterial({
	_transmission: 1,
	thickness: 1,
	roughness: 0,
	chromaticAberration: .5,
	anisotropicBlur: .5,
	distortion: .5,
	distortionScale: .5,
	temporalDistortion: .5,
	samples: 10,
})

material.clearcoat = .5;

const obj = new class extends MeshActor
{
	constructor()
	{
		super(geo, material);
		this.rotation.x = Math.PI / 3;
		this.rotation.z = Math.PI / -1.1;
		this.addComponent(new FloatBehavior())
	}

	override onUpdate(d: number, e: number)
	{
		super.onUpdate(d, e);
		this.scale.setScalar(.2);
		(this.material as MeshTransmissionMaterial).onUpdate(d, this.app!, this.scene!, this.object3d)
	}
}

scene.addComponent(obj)

// Create an actor that holds the environment map / scene
const env = new EnvironmentActor;
env.background = true;
env.backgroundBlur = 4;
env.backgroundIntensity = .1;
scene.addComponent(env);

const dirLight = new DirectionalLightActor;
dirLight.intensity = 1;
dirLight.position.set(0, 1, 0);
scene.addComponent(dirLight);

// Load the scene
await app.loadScene(scene);