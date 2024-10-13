import { css, defineComponent, ElysiaElement, html } from "./UI";
export class ElysiaButton extends ElysiaElement {
    static Tag = "elysia-button";
    static styles = css `
        button {
            padding: 0.5em 1em;
            border: none;
            background-color: var(--elysia-color-purple);
            color: var(--elysia-color-cullen);
            border-radius: 1rem;
            transition: all 0.1s;
            user-select: none;
            font-family: var(--elysia-font-family);

            &:hover {
                cursor: pointer;
                background-color: oklch(from var(--elysia-color-purple) calc(l * .9) c h);
            }

            &:active {
                background-color: oklch(from var(--elysia-color-purple) calc(l * 1.1) c h);
            }
        }
	`;
    onRender() {
        return html `
			<button>
				<slot></slot>
			</button>`;
    }
}
defineComponent(ElysiaButton);
