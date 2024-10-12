import { HalloweenGame } from "./Game.ts";
import { MainMenuScene } from "./MainMenu.ts";
import { TestScene } from "./TestScene.ts";


await HalloweenGame.loadScene(new TestScene);
// await HalloweenGame.loadScene(new MainMenuScene());