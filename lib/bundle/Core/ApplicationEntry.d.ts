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
        hasElysiaEvents?: boolean;
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
    manualUpdate?: boolean;
}
export declare class Application {
    #private;
    /**
     * The application instance's event queue.
     */
    readonly events: ElysiaEventQueue;
    /**
     * The application instance's mouse observer.
     * The position of the mouse and intersecting objects are updated at the start of each frame.
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
     * If this s_App should call Elysia UIs `defaultScheduler.update()` in it's update loop.
     * @default true
     */
    updateDefaultUiScheduler: boolean;
    /**
     * The maximum number of consecutive errors that can occur inside update() before stopping.
     * If manualUpdate is enabled this will have no effect.
     */
    maxErrorCount: number;
    /**
     * If the application should not schedule updates automatically.
     * If true, you must call Application.update() manually.
    */
    manualUpdate: boolean;
    /**
     * The active render pipeline.
     */
    get renderPipeline(): RenderPipeline;
    /**
     * The active s_Scene.
    */
    get scene(): Scene | undefined;
    /** The Application's AssetLoader instance */
    get assets(): AssetLoader<any>;
    constructor(config?: ApplicationConstructorArguments);
    /**
     * Load a s_Scene into the application. This will unload the previous s_Scene.
     * @param scene
     */
    loadScene(scene: Scene): Promise<void>;
    /** Destroy the application and all of it's resources. */
    destructor(): void;
    /** The main update loop for the application. */
    update(): void;
}
export {};
