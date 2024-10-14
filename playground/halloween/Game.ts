import { Application } from "../../src/Core/ApplicationEntry.ts";
import { BasicRenderPipeline } from "../../src/RPipeline/BasicRenderPipeline.ts";
import { Assets } from "./Assets.ts";

export const HalloweenGame = new Application({
	renderPipeline: new BasicRenderPipeline,
	stats: true,
	assets: Assets,
});
