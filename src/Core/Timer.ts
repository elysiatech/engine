export class Timer {

	autoStart: boolean = true;

	startTime: number = 0;

	oldTime: number = 0;

	elapsedTime: number = 0;

	running: boolean = false;

	constructor(args: { autoStart?: boolean } = {}) {
		if(typeof args.autoStart !== "undefined"){
			this.autoStart = args.autoStart;
		}
	}

	public start() {
		this.startTime = performance.now();
		this.oldTime = this.startTime;
		this.elapsedTime = 0;
		this.running = true;
	}

	public stop() {
		this.getElapsedTime();
		this.running = false;
		this.autoStart = false;
	}

	public getElapsedTime() {
		this.getDelta();
		return this.elapsedTime;
	}

	public getDelta() {
		let diff = 0;
		if ( this.autoStart && ! this.running ) {
			this.start();
			return 0;
		}
		if (this.running) {
			const newTime = performance.now();
			diff = ( newTime - this.oldTime ) / 1000;
			this.oldTime = newTime;
			this.elapsedTime += diff;
		}
		return diff;
	}
}