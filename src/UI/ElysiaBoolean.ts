import { attribute, css, defineComponent, ElysiaElement, html } from "./UI.ts";
import { query } from "lit/decorators.js";
import { bound } from "../Core/Utilities.ts";

export class ElysiaBoolean extends ElysiaElement {
	static override Tag = "elysia-boolean";

	static styles = css`
        input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            position: relative;
            font-size: inherit;
            width: 3rem;
            height: 1.5rem;
            box-sizing: content-box;
            border-radius: 1rem;
            vertical-align: text-bottom;
            margin: auto;
            color: inherit;
            background-color: var(--elysia-color-aro);
			cursor: pointer;

            &::before {
                content: "";
                position: absolute;
                top: 50%;
                left: 0;
                transform: translate(0, -50%);
                transition: all 0.2s ease;
                box-sizing: border-box;
                width: 1.3rem;
                height: 1.3rem;
                margin: 0 0.125rem;
                border-radius: 50%;
                background: var(--elysia-color-voncount);
            }

            &:checked {
                background: var(--elysia-color-voncount);
            }

            &:checked::before {
                left: 1.45rem;
                background-color: var(--elysia-color-cullen);
            }
        }
	`

	@query("#input") accessor input: HTMLInputElement | null = null;

	@attribute({ type: Boolean, reflect: false }) accessor value: boolean | undefined;

	@attribute({ type: Boolean }) accessor defaultValue = false;

	private controlled = false;

	onMount() { if(typeof this.value !== "undefined") this.controlled = true; }

	public override onRender()
	{
		return html`<input id="input" type="checkbox" checked="${this.controlled ? this.value : this.defaultValue}" @change=${this.onChange}>`;
	}

	@bound private onChange (e: Event)
	{
		const val = (e.target as HTMLInputElement).checked;
		if(this.controlled) (this.input as HTMLInputElement).checked = !!this.value;
		else
		{
			this.value = (e.target as HTMLInputElement).checked;
		}
		this.dispatchEvent(new CustomEvent("change", { detail: val }));
	}
}

defineComponent(ElysiaBoolean);