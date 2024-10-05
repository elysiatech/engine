import { WorkerThread } from "../Core/WorkerThread.ts";
import Rapier from "@dimforge/rapier3d-compat";

class PhysicsWorker extends WorkerThread
{

	world?: Rapier.World;
	scene?: any;

	async onInit(args: { gravity: { x: number, y: number, z: number } })
	{
		await Rapier.init();
		this.world = new Rapier.World(args.gravity);
	}

	onStart(args: { scene: any })
	{

	}

	onGetDebugData()
	{

	}
}

new PhysicsWorker().listen();