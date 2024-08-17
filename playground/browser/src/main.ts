import "./styles.css";
import * as Effects from "postprocessing";
import { HighDefinitionRenderPipeline } from "../../../src/render_pipelines/HighDefinitionRenderPipeline.ts";
import { Game, Scene, ActiveCameraTag } from "../../../src/mod.ts";
import { EnvironmentActor } from "../../../src/actors/EnvironmentActor.ts";
import { PerspectiveCameraActor } from "../../../src/actors/PerspectiveCameraActor.ts";
import { CameraOrbitBehavior } from "../../../src/behaviors/CameraOrbitBehavior.ts";
import { PrimitiveCubeActor } from "../../../src/actors/Primitives.ts";
import { FloatBehavior } from "../../../src/behaviors/FloatBehavior.ts";

const hdRP = new HighDefinitionRenderPipeline({
	canvas: document.getElementById("game") as HTMLCanvasElement,
	effects: () => [
		new Effects.RenderPass(),
		new Effects.EffectPass(undefined, new Effects.ChromaticAberrationEffect()),
		new Effects.EffectPass(
			undefined,
			new Effects.ToneMappingEffect({
				mode: Effects.ToneMappingMode.ACES_FILMIC,
			}),
		),
		new Effects.EffectPass(
			undefined,
			new Effects.SMAAEffect({
				preset: Effects.SMAAPreset.ULTRA,
			}),
		),
	],
});

const game = new Game({ renderPipeline: hdRP });

class TestScene extends Scene {
	environment = new EnvironmentActor({
		background: true,
		backgroundBlur: 2,
	});

	camera = new PerspectiveCameraActor();

	override async setup() {
		await super.setup();

		this.camera
			.addChild(new CameraOrbitBehavior())
			.addTag(ActiveCameraTag).position.z = 5;

		this.root.addChild(this.camera);

		this.root.addChild(this.environment);

		this.root.addChild(
			new PrimitiveCubeActor().addChild(new FloatBehavior()),
		);
	}
}

console.log("Loading scene");
await game.loadScene(new TestScene());
console.log("Playing scene");
game.play();
