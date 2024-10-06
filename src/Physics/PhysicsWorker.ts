import { WorkerThread } from "../Core/WorkerThread.ts";
import Rapier from "@dimforge/rapier3d-compat";

class PhysicsWorker extends WorkerThread
{
	world?: Rapier.World;
	ready = false;

	constructor() {
		super();
		console.log("Physics worker created")
	}

	async onInit(world: ArrayBuffer){
		await Rapier.init()
		console.log("Physics worker initialized")
		this.ready = true;
		this.world = Rapier.World.restoreSnapshot(new Uint8Array(world));
	}

	onUpdate(world: ArrayBuffer)
	{
		if(!this.ready) return;
		this.world = Rapier.World.restoreSnapshot(new Uint8Array(world));
		if(!this.world) return;
		this.world.step();
		this.send("update", this.world.takeSnapshot().buffer);
	}
}

new PhysicsWorker().listen();