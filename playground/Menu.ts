import { c, defineComponent, ElysiaElement, h } from "../src/UI/UI.ts";
import "../src/UI/Theme.ts"

export class ElysiaStats extends ElysiaElement
{
	static Tag = "elysia-menu";

	visible = false;

	static styles = c`	
		:host {
			position: fixed;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: 2000;
		}
		nav {
			background: #282a3680;
			color: white;
			padding: 0.5em;
			font-family: Kode Mono, serif;
			font-size: 1em;
			font-weight: 300;
			display: flex;
			gap: 1em;
			border-radius: 0 0 0.5em 0.5em;
			backdrop-filter: blur(2px);
			transition: all 0.5s ease;
		}
		.inv { opacity: 0; transform: translateY(-100%); }
		
		a {
			 color: #f8f8f2;
		}
		
		a:visited {
			color: #BD93F9;
		}
	`

	onMount() {
		document.head.insertAdjacentHTML(
			'beforeend',
			`<link href="https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400..700&display=swap" rel="stylesheet">`
		);
		setTimeout(() => this.visible = true, 500);
	}

	onRender()
	{
		return h`
			<nav class=${this.visible ? '' : 'inv'}>
				<a href="/">Hello World</a>
				<a href="/?physics">Physics Playground</a>
				<a href="/?transmission">Transmission</a>
			</nav>
		`
	}
}

defineComponent(ElysiaStats);