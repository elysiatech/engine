import { defaultScheduler, defineComponent, ElysiaElement, html } from "../../src/UI/UI.ts";
import "../../src/UI/ElysiaUiStats.ts";

const test = {
	a: 3,
	b: 4,
	c: 5,
	e: "lol"
}

export class TestComponent extends ElysiaElement
{
	static Tag = "test-component";

	render()
	{
		return html`
			<div style="display: flex; font-size: 5px">
				<p>Hello ${test.a}</p>
				<p>${test.b} This is ${test.e}</p>
				<div>width: ${window.innerWidth} height: ${window.innerHeight}</div>
			</div>
		`
	}
}

defineComponent(TestComponent);
document.body.style.display = "flex";
document.body.style.flexWrap = "wrap";

for(let i = 0; i < 1000; i++)
{
	document.body.appendChild(document.createElement("test-component"));
}

const update = () => (requestAnimationFrame(update), defaultScheduler.update());
update();

document.body.appendChild(document.createElement("elysia-ui-stats"));