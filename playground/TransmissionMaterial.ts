import * as Three from "three";
import * as Elysia from "../src/mod.ts";
import { MeshTransmissionMaterial } from "../src/WebGL/MeshTransmissionMaterial.ts"


// Create the application.
const app = new Elysia.Core.Application({
	renderPipeline: new Elysia.RPipeline.BasicRenderPipeline,
	stats: true,
});

// Create a s_Scene
const scene = new Elysia.Scene.Scene;

const camera = new Elysia.Actors.PerspectiveCameraActor;
camera.position.set(0, 0, 5);
scene.activeCamera = camera;
scene.addComponent(camera);
camera.addComponent(new Elysia.Behaviors.CameraOrbitBehavior)

const text = new Elysia.Actors.TextActor({ text: "Elysiatech", fontSize: 1 });
text.color = new Three.Color(Elysia.Core.Colors.Pink);
scene.addComponent(text);

const spring = await new Elysia.Assets.GLTFAsset("/assets/spring.glb").load()

const geo = (spring!.clone().children[0] as Three.Mesh).geometry;

const material = new MeshTransmissionMaterial({
	_transmission: 1,
	thickness: 4,
	roughness: 0,
	chromaticAberration: .05,
	anisotropicBlur: 0,
	distortion: 0,
	distortionScale: 0,
	temporalDistortion: 0,
	samples: 10,
})

material.clearcoat = .5;

const obj = new class extends Elysia.Actors.MeshActor
{
	constructor()
	{
		super(geo, material);
		this.rotation.x = Math.PI / 3;
		this.rotation.z = Math.PI / -1.1;
		this.addComponent(new Elysia.Behaviors.FloatBehavior())
	}

	override onUpdate(d: number, e: number)
	{
		super.onUpdate(d, e);
		this.scale.setScalar(.2);
		(this.material as MeshTransmissionMaterial).onUpdate(d, this.app!, this.scene!, this.object3d)
	}
}

scene.addComponent(obj)

// Create an actor that holds the environment map / s_Scene
const env = new Elysia.Actors.EnvironmentActor;
scene.addComponent(env);

scene.object3d.background = new Three.Color(Elysia.Core.Colors.Aro);

const dirLight = new Elysia.Actors.DirectionalLightActor;
dirLight.intensity = 1;
dirLight.position.set(0, 1, 0);
scene.addComponent(dirLight);

// Load the s_Scene
await app.loadScene(scene);