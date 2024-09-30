import { ElysiaElement, defineComponent, h, c } from "./UI";
import { ELYSIA_VERSION } from "../Core/Constants.ts";

export class ElysiaStats extends ElysiaElement
{
	static Tag = "elysia-stats";

	visible = false;

	public stats = {
		calls: 0,
		fps: 0,
		lines: 0,
		points: 0,
		triangles: 0,
		memory: 0,
	}

	static styles = c`	
		:host {
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 1000;
			pointer-events: none;
		}
		aside {
			background: rgba(0, 0, 0, 0.5);
			color: white;
			padding: 0.5em;
			font-family: Kode Mono, serif;
			font-size: .7em;
			font-weight: 300;
			display: flex;
			grid-template-columns: 1fr 1fr;
			grid-gap: .25em 1em;
			border-radius: 0 .5em 0 0;
			backdrop-filter: blur(2px);
			transition: all 0.5s ease;
		}
		@media (max-width: 620px) {
			aside { 
				display: grid;
				font-size: .5em;
			}
		}
		.purple { color: #ee95ff; }
		.red { color: red; }
		.white { color: white; }
		.inv { opacity: 0; transform: translateY(100%); }
	`

	onMount() {
		document.head.insertAdjacentHTML(
			'beforeend',
			`<link href="https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400..700&display=swap" rel="stylesheet">`
		);
		setTimeout(() => this.visible = true, 500);
	}

	render()
	{
		return h`
			<aside id="stats" class=${this.visible ? '' : 'inv'}>
				<div class="purple">elsyia ${ELYSIA_VERSION}</div>
				<div class=${this.stats.fps < 60 ? 'red' : 'white'}>fps: ${this.stats.fps}</div>
				<div class=${this.stats.calls > 500 ? 'red' : 'white'}>drawcalls: ${this.stats.calls}</div>
				<div>memory: ${this.stats.memory}</div>
				<div>triangles: ${this.stats.triangles}</div>
				<div>lines: ${this.stats.lines}</div>
				<div>points: ${this.stats.points}</div>
			</aside>
		`
	}
}

defineComponent(ElysiaStats);