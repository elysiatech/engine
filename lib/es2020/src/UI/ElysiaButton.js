import { css, defineComponent, ElysiaElement, html } from "./UI.js";
export class ElysiaButton extends ElysiaElement {
    onRender() {
        return html `
			<button>
				<slot></slot>
			</button>`;
    }
}
Object.defineProperty(ElysiaButton, "Tag", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "elysia-button"
});
Object.defineProperty(ElysiaButton, "styles", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: css `
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
	`
});
defineComponent(ElysiaButton);
