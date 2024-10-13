import { attribute, css, defineComponent, ElysiaElement, html } from "./UI";

export class ElysiaEnum extends ElysiaElement {
	static override Tag = "elysia-enum";

	static styles = css`
		select {
			padding: 0.5em 1em 0.5em 1em;
            background-color: var(--elysia-color-aro);
            border: 1px solid var(--elysia-color-purple);
            color: var(--elysia-color-cullen);
			border-radius: 1rem;
			transition: all 0.1s;
			user-select: none;
			font-family: var(--elysia-font-family);
			
			&:hover {
				cursor: pointer;
				background-color: oklch(from var(--elysia-color-aro) calc(l * 1.1) c h);
			}
			
			&:active {
				background-color: oklch(from var(--elysia-color-aro) calc(l * 1.2) c h);
			}
		}
	`

	@attribute() accessor value = "";

	@attribute() accessor options = [
		"Option 1",
		"Option 2",
		"Option 3"
	]

	onChange?: (value: string) => void;

	public override onRender() {
		return html`
			<select @change=${this.#onChange}>
				${this.options.map(option => html`<option value="${option}" ?selected=${option === this.value}>${option}</option>`)}
			</select>
		`;
	}

	#onChange = (e: Event) => {
		this.value = (e.target as HTMLSelectElement).value;
		if (this.onChange) this.onChange(this.value);
	}
}

defineComponent(ElysiaEnum);