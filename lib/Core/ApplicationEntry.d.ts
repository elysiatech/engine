import { LogLevel } from "../Logging/Levels";
import { ElysiaEventQueue } from "../Events/EventQueue";
import { AssetLoader } from "../Assets/AssetLoader";
import { Profiler } from "./Profiler";
import { AudioPlayer } from "../Audio/AudioPlayer";
import { MouseObserver } from "../Input/Mouse";
import { Scene } from "../Scene/Scene";
import { RenderPipeline } from "../RPipeline/RenderPipeline";
import { Actor } from "../Scene/Actor";
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
    readonly input: any;
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
    get renderPipeline(): any;
    get assets(): AssetLoader<any>;
    constructor(config?: ApplicationConstructorArguments);
    loadScene(scene: Scene): Promise<void>;
    destructor(): void;
    private update;
}
export {};
