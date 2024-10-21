import { attribute, css, defineComponent, ElysiaElement, html } from "./UI.js";
import { bound } from "../Core/Utilities.js";
export class ElysiaVector extends ElysiaElement {
    static Tag = "elysia-vector";
    static styles = css `
		:host {
			display: flex;
			gap: 4px;
		}

        elysia-number-input::part(input) {
            max-width: 50px;
        }

		.title {
			position: absolute;
			right: 8px;
			pointer-events: none;
			top: 50%;
			transform: translateY(-50%);
            font-size: .75rem;
            color: var(--elysia-color-purple);
		}

		.vec {
			position: relative;
		}
	`;
    @attribute({ converter: (v) => (console.log(v), JSON.parse(v)) })
    accessor value = { x: 0, y: 0, z: 0, w: 12 };
    onRender() {
        return html `${Object.keys(this.value).map(this.createElement)}`;
    }
    @bound
    createElement(name) {
        return html `
			<div class="vec">
				<div class="title">${name}</div>
				<elysia-number-input value=${this.value[name]} @change=${(e) => this.onInput(name, e)}></elysia-number-input>
			</div>
		`;
    }
    @bound
    onInput(name, e) {
        this.value[name] = e.detail;
        console.log(this.value);
        this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
    }
}
defineComponent(ElysiaVector);
