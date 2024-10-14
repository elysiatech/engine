import { LogLevel } from "../Logging/Levels.ts";
import { ElysiaEventQueue } from "../Events/EventQueue.ts";
import { InputQueue } from "../Input/InputQueue.ts";
import { AssetLoader } from "../Assets/AssetLoader.ts";
import { Profiler } from "./Profiler.ts";
import { AudioPlayer } from "../Audio/AudioPlayer.ts";
import { MouseObserver } from "../Input/Mouse.ts";
import { Scene } from "../Scene/Scene.ts";
import { RenderPipeline } from "../RPipeline/RenderPipeline.ts";
import { Actor } from "../Scene/Actor.ts";
declare module 'three' {
    interface Object3D {
        actor?: Actor<any>;
    }
}
interface ApplicationConstructorArguments {
    output?: HTMLCanvasElement;
    logLevel?: LogLevel;
    eventQueue?: ElysiaEventQueue;
    profiler?: Profiler;
    assets?: AssetLoader<any>;
    audio?: AudioPlayer;
    renderPipeline?: RenderPipeline;
    stats?: boolean;
    updateDefaultUiScheduler?: boolean;
}
export declare class Application {
    #private;
    /**
     * The application instance's event queue.
     */
    readonly events: ElysiaEventQueue;
    /**
     * The application instance's mouse observer.
     */
    readonly mouse: MouseObserver;
    /**
     * The input queue for this application.
     */
    readonly input: InputQueue;
    /**
     * Application profiler instance.
     */
    readonly profiler: Profiler;
    /**
     * Applications audio player instance.
     */
    readonly audio: AudioPlayer;
    /**
     * If this App should call Elysia UI's `defaultScheduler.update()` in it's update loop.
     */
    updateDefaultUiScheduler: boolean;
    /**
     * The maximum number of consecutive errors that can occur inside update() before stopping.
     */
    maxErrorCount: number;
    /**
     * The active render pipeline.
     */
    get renderPipeline(): RenderPipeline;
    get assets(): AssetLoader<any>;
    constructor(config?: ApplicationConstructorArguments);
    loadScene(scene: Scene): Promise<void>;
    destructor(): void;
    private update;
}
export {};
