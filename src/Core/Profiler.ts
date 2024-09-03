import { Application } from "./Application";

export class Profiler {

	public avgFrameTimeThreshold = 1000 / 30

	constructor(private app: Application) {}

	updateFrameTime(delta: number){
		this.deltas.push(delta)
		if(this.deltas.length > 20){
			this.deltas.shift()
		}
	}

	private onIncline?: (app: Application) => void
	private onDecline?: (delta: Application) => void

	protected deltas: number[] = []
}
