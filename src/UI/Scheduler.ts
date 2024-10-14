import { ElysiaElement } from "./UI.ts";

export class Scheduler
{
	frametime: number = 0;

	components = new Set<ElysiaElement>;

	subscribe(component: ElysiaElement)
	{
		this.components.add(component);
	}

	unsubscribe(component: ElysiaElement)
	{
		this.components.delete(component);
	}

	update()
	{
		const t = performance.now();
		for (const component of this.components) {
			component._onUpdate()
		}
		this.frametime = performance.now() - t;
	}
}

export const defaultScheduler = new Scheduler;
