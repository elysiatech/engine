import { attribute, BooleanConverter, css, defineComponent, ElysiaElement, html } from "./UI.js";
import { query } from "lit/decorators.js";
import { bound, toBoolean } from "../Core/Utilities.js";
export class ElysiaBoolean extends ElysiaElement {
    static Tag = "elysia-boolean";
    static styles = css `
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
	`;
    @query("#input")
    accessor input = null;
    get value() { return this.#internalValue; }
    @attribute()
    set value(val) {
        if (typeof val === undefined) {
            this.controlled = false;
            this.#internalValue = !!this.input?.checked;
        }
        else {
            this.controlled = true;
            this.#internalValue = BooleanConverter(val);
            if (this.input)
                this.input.checked = BooleanConverter(val);
        }
    }
    @attribute({ converter: BooleanConverter })
    accessor defaultValue = false;
    controlled = false;
    onMount() {
        if (typeof this.value !== "undefined") {
            this.controlled = true;
            this.#internalValue = toBoolean(this.value);
        }
        else {
            this.value = this.defaultValue;
            this.controlled = false;
        }
    }
    onRender() {
        return html `<input id="input" type="checkbox" .checked="${this.#internalValue}" @change=${this.onChange}>`;
    }
    @bound
    onChange(e) {
        const val = e.target.checked;
        if (this.controlled)
            this.input.checked = !!this.value;
        else
            this.#internalValue = e.target.checked;
        this.dispatchEvent(new CustomEvent("change", { detail: val }));
    }
    #internalValue = false;
}
defineComponent(ElysiaBoolean);
