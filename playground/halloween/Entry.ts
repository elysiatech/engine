import { HalloweenGame } from "./Game.ts";
import { TestScene } from "./TestScene.ts";

document.title = "🎃🎃🎃"

await HalloweenGame.loadScene(new TestScene);
// await HalloweenGame.loadScene(new MainMenuScene());