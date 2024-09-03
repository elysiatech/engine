import "./styles.css";
import { ChromaticAberrationEffect, EffectPass, RenderPass, SMAAEffect, SMAAPreset, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { HighDefinitionRenderPipeline } from "../../../src/RenderPipelines/HighDefinitionRenderPipeline.ts";
import { Game, Scene, ActiveCameraTag, Behavior, Actor } from "../../../src/mod.ts";
import { EnvironmentActor } from "../../../src/Actors/EnvironmentActor.ts";
import { PerspectiveCameraActor } from "../../../src/Actors/PerspectiveCameraActor.ts";
import { CameraOrbitBehavior } from "../../../src/Behaviors/CameraOrbitBehavior.ts";
import { PrimitiveCubeActor } from "../../../src/Actors/Primitives.ts"
import { SpinBehavior } from "../../../src/Behaviors/SpinBehavior.ts";
import * as Three from "three";
import { css, html } from "../../../src/UI/UI.ts"
import { Asset } from "../../../src/Assets"
import { AssetLoader } from "../../../src/Assets/AssetLoader.ts";

const hdRP = new HighDefinitionRenderPipeline({
	canvas: document.getElementById("game") as HTMLCanvasElement,
	effects: () => [
		new RenderPass(),
		new EffectPass(undefined, new ChromaticAberrationEffect()),
		new EffectPass(
			undefined,
			new ToneMappingEffect({
				mode: ToneMappingMode.ACES_FILMIC,
			}),
		),
		new EffectPass(
			undefined,
			new SMAAEffect({
				preset: SMAAPreset.ULTRA,
			}),
		),
	],
});

class UndefinedAsset extends Asset<any> {
	async loader(){
		return undefined;
	}
}

const assetLoader = new AssetLoader({
	undef: new UndefinedAsset
})

const game = new Game({ renderPipeline: hdRP });

class SimpleKeyBoardMovement extends Behavior {

	velocity = new Three.Vector3;

	onCreate(): void {

		const input = this.scene!.input!

	    input.onInputDown(["w"], () => {
	    	this.velocity.z = -3;
	    })

	    input.onInputDown(["s"], () => {
	    	this.velocity.z = 3;
	    })

	    input.onInputDown(["a"], () => {
	    	this.velocity.x = -3;
	    })

	    input.onInputDown(["d"], () => {
	    	this.velocity.x = 3;
	    })

	    input.onInputUp("w", () => {
	    	if(input.getCurrentState().s.pressed) return;
	    	this.velocity.z = 0;
	    })

	    input.onInputUp("s", () => {
	    	if(input.getCurrentState().w.pressed) return;
	    	this.velocity.z = 0;
	    })

	    input.onInputUp("a", () => {
	    	if(input.getCurrentState().d.pressed) return;
	    	this.velocity.x = 0;
	    })

	    input.onInputUp("d", () => {
	    	if(input.getCurrentState().a.pressed) return;
	    	this.velocity.x = 0;
	    })
	}

	onUpdate(delta: number): void {
		this.parent!.position.add(this.velocity.clone().multiplyScalar(delta));
	}

}

class UiTest extends Actor {

	static override GUIStylesheet = css`
		:host {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 999;
		}
	`

	frametime: number = 0;

	override onUpdate(frametime: number){
		this.frametime = frametime;
	}

	override gui(){
		return html`<div>${(1 / this.frametime).toFixed(0)}</div>`
	}
}

class TestScene extends Scene {

	environment = new EnvironmentActor({
		background: true,
		backgroundBlur: 2,
	});

	camera = new PerspectiveCameraActor;

	override async setup() {
		await super.setup();

		await assetLoader.load()

		this.camera
			.addChild(new CameraOrbitBehavior)
			.addTag(ActiveCameraTag).position.z = 5;

		this.root.addChild(this.camera);

		this.root.addChild(this.environment);

		const cube = new PrimitiveCubeActor;

		this.root.addChild(new UiTest)

		cube.addChild(new SpinBehavior).addChild(new SimpleKeyBoardMovement);

		this.root.addChild(cube)

	}
}

console.log("Starting game...");
await game.loadScene(new TestScene);
console.log("Game started!");
game.play();
