import { ElysiaEvent } from "../Events/Event";
import { Audio } from "./Audio";

export class AudioPlayEvent extends ElysiaEvent<Audio> {}
export class AudioPauseEvent extends ElysiaEvent<Audio> {}
export class AudioStopEvent extends ElysiaEvent<Audio> {}
export class AudioSeekEvent extends ElysiaEvent<Audio> {}
export class AudioVolumeEvent extends ElysiaEvent<Audio> {}
export class AudioErrorEvent extends ElysiaEvent<Audio> {}
export class AudioMuteEvent extends ElysiaEvent<Audio> {}
