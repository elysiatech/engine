import { ElysiaElement, defineComponent, h, c } from "./UI";

export class ElysiaStats extends ElysiaElement
{
	static Tag = "elysia-stats";

	public stats = {
		calls: 0,
		fps: 0,
		lines: 0,
		points: 0,
		triangles: 0,
	}

	static styles = c`
		:host {
			position: fixed;
			top: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.5);
			color: white;
			padding: 0.5em;
			font-family: monospace;
			font-size: 0.8em;
			z-index: 1000;
		}
		
		aside {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-gap: 0.5em;
		}
		
		.red {
			color: red;
		}
		
		.white {
			color: white;
		}
	`

	render()
	{
		return h`
			<aside>
				<div class=${this.stats.fps < 60 ? 'red' : 'white'}>fps: ${this.stats.fps}</div>
				<div class=${this.stats.calls > 500 ? 'red' : 'white'}>drawcalls: ${this.stats.calls}</div>
				<div>lines: ${this.stats.lines}</div>
				<div>points: ${this.stats.points}</div>
				<div>triangles: ${this.stats.triangles}</div>
			</aside>
		`
	}
}

defineComponent(ElysiaStats);