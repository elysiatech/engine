import { ElysiaEvent } from "../Events/Event.ts";
import { Audio } from "./Audio.ts";
export declare class AudioPlayEvent extends ElysiaEvent<Audio> {
}
export declare class AudioPauseEvent extends ElysiaEvent<Audio> {
}
export declare class AudioStopEvent extends ElysiaEvent<Audio> {
}
export declare class AudioSeekEvent extends ElysiaEvent<Audio> {
}
export declare class AudioVolumeEvent extends ElysiaEvent<Audio> {
}
export declare class AudioErrorEvent extends ElysiaEvent<Audio> {
}
export declare class AudioMuteEvent extends ElysiaEvent<Audio> {
}
