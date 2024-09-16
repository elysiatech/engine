import * as Three from "three";
import { EventQueue, EventQueueMode } from "../Events/events";
import { InputQueue } from "./Input";
import { Scheduler } from "../UI/UI";
export class Application {
    getCanvas() { return this.canvas; }
    getClock() { return this.clock; }
    getInput() { return this.input; }
    getEvents() { return this.events; }
    getUiScheduler() { return this.uiScheduler; }
    getPointerPosition() { return this.mousePosition; }
    getRenderer() { return this.renderer; }
    getScene() { return this.currentScene; }
    getGameLoop() { return this.gameLoop; }
    constructor(config) {
        this.renderer = config.renderer;
        this.canvas = this.renderer.getGl().domElement;
        this.events.mode = EventQueueMode.Queued;
        this.gameLoop = this.gameLoop.bind(this);
        this.canvas.addEventListener("mousemove", e => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
    }
    async loadScene(scene) {
        this.isLoadingScene = true;
        this.unloadScene();
        this.awaitedSetup = scene.init();
        await this.awaitedSetup;
        this.renderer.onLoadScene?.(this, scene);
        this.isLoadingScene = false;
        this.currentScene = scene;
    }
    async play() {
        if (!this.currentScene)
            return;
        this.input.enable();
        this.clock.start();
        this.currentScene.onPlay();
    }
    async unloadScene() {
        if (this.currentScene) {
            const scene = this.currentScene;
            delete this.currentScene;
            await this.awaitedSetup;
            this.renderer.onUnloadScene?.(this, scene);
            scene.destructor();
        }
    }
    gameLoop() {
        if (!this.currentScene)
            return;
        requestAnimationFrame(this.gameLoop);
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();
        this.events.flush();
        this.input.replay();
        this.currentScene?.onUpdate?.(delta, elapsed);
        this.uiScheduler.update();
        this.currentScene.render(this.renderer, delta, elapsed);
    }
    mousePosition = new Three.Vector2;
    canvas;
    input = new InputQueue;
    events = new EventQueue;
    clock = new Three.Clock;
    uiScheduler = new Scheduler;
    isLoadingScene = false;
    currentScene;
    renderer;
    awaitedSetup;
}
