import { Core, Scene} from "../src/mod.ts"

const app = new Core.Application({
	stats: true,
})

class Child extends Scene.Actor
{
	onCreate()
	{
		console.log("Child created")
	}

	onEnable(): void {
		console.log("Child enabled")
	}

	onEnterScene(): void {
		console.log("Child entered scene")
	}

	onStart(): void {
		console.log("Child started")
	}

	onBeforePhysicsUpdate(delta: number, elapsed: number): void {
		console.log("Child before physics update")
	}

	onUpdate(): void {
		console.log("Child updated")
	}

	onDisable(): void {
		console.log("Child disabled")
	}

	onLeaveScene(): void {
		console.log("Child exited scene")
	}

	onDestroy(): void {
		console.log("Child destroyed")
	}

	onResize(width: number, height: number): void {
		console.log("Child resized")
	}
}

class CustomScene extends Scene.Scene
{
	override onCreate(): void {
		console.log("Scene created")
		const c = new Child;
		this.addComponent(c)

		setTimeout(() => {
			this.destructor()
		}, 1000)
	}

	override onStart(): void {
		console.log("Scene started")
	}

	override onBeforePhysicsUpdate(delta: number, elapsed: number): void {
		console.log("Scene before physics update")
	}

	override onUpdate(): void {
		console.log("Scene updated")
	}

	override onDestroy(): void {
		console.log("Scene destroyed")
	}
}

app.loadScene(new CustomScene)
