import { attribute, css, defineComponent, ElysiaElement, html } from "./UI.ts";
import { query } from "lit/decorators.js";
import "corel-color-picker/corel-color-picker.js"

export class ElysiaButton extends ElysiaElement
{
	static override Tag = "elysia-button";

	static styles = css`
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

	public override render()
	{
		return html`<button><slot></slot></button>`;
	}
}

defineComponent(ElysiaButton);

export class ElysiaNumberInput extends ElysiaElement
{
	static override Tag = "elysia-number-input";

	static styles = css`
		input {
            padding: 0.5em 1em;
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

            &:focus {
                outline: none;
            }
			
			&::-webkit-inner-spin-button,
			&::-webkit-outer-spin-button {
				-webkit-appearance: none;
            }
			
			&[type=number] {
				-moz-appearance: textfield;
            }
			
			&:invalid {
				background-color: oklch(from var(--elysia-color-red) calc(l * 1.15) c h);
            }
        }
	`

	@query("#input") accessor input: Element | null = null;

	@attribute() accessor value = "0";

	@attribute() accessor min = "-Infinity";

	@attribute() accessor max = "Infinity";

	@attribute() accessor step = "0.1";

	onChange?: (value: number) => void;

	public override render()
	{
		return html`
			<input 
				part="input" 
				id="input" 
				type="number" 
				value="${this.value}" 
				min="${this.min}" 
				max="${this.max}" 
				step="${this.step}"
				@mousedown=${this.onMouseDown}
				@input=${this.#onInput}
			>
		`;
	}

	initialMousePos = { x: 0, y: 0 };

	onMouseDown = (e: MouseEvent) =>
	{
		const mousex = e.clientX;
		const bounds = this.input?.getBoundingClientRect();
		// only want the last 50% of the input to be draggable
		if (bounds && mousex < bounds.left + bounds.width * 0.5) return;
		this.initialMousePos = { x: e.clientX, y: e.clientY };
		window.addEventListener("mousemove", this.onMouseDrag);
		window.addEventListener("mouseup", this.onMouseUp);
	}

	onMouseDrag = (e: MouseEvent) =>
	{
		e.stopPropagation();
		const diff = e.clientX - this.initialMousePos.x;
		const step = Number(this.step);
		const value = Number(this.value) + Math.round(diff) * step;
		this.value = Math.min(Math.max(value, Number(this.min)), Number(this.max)).toFixed(2).toString();
		(this.input as HTMLInputElement).value = this.value;
		if (this.onChange) this.onChange(Number(this.value));
		this.initialMousePos = { x: e.clientX, y: e.clientY };
	}

	onMouseUp = () =>
	{
		window.removeEventListener("mousemove", this.onMouseDrag);
		window.removeEventListener("mouseup", this.onMouseUp);
	}

	#onInput(e: Event)
	{
		const value = (e.target as HTMLInputElement).value;
		if (this.onChange) this.onChange(Number(value));
	}
}

defineComponent(ElysiaNumberInput);

export class ElysiaTextInput extends ElysiaElement {
	static override Tag = "elysia-text-input";

	static styles = css`
        input {
            padding: 0.5em 1em;
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

            &:focus {
                outline: none;
            }

            &::placeholder {
                color: var(--elysia-color-purple);
            }

            &:invalid {
                background-color: oklch(from var(--elysia-color-red) calc(l * 1.15) c h);
            }

            &[type=number] {
                -moz-appearance: textfield;
            }
        }
	`

	@attribute() accessor value = "";

	@attribute() accessor placeholder = "";

	onChange?: (value: string) => void;

	public override render() {
		return html`
			<input
					type="text"
					value="${this.value}"
					placeholder="${this.placeholder}"
					
			>
		`;
	}
}

defineComponent(ElysiaTextInput);

export class ElysiaBoolean extends ElysiaElement
{
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

	@attribute() accessor checked = false;

	onChange?: (checked: boolean) => void;

	public override render()
	{
		return html`
			<input type="checkbox" ?checked="${this.checked}" @change=${this.#onChange}>
		`;
	}

	#onChange = (e: Event) =>
	{
		this.checked = (e.target as HTMLInputElement).checked;
		if(this.onChange) this.onChange(this.checked);
	}

}

defineComponent(ElysiaBoolean);

export class ElysiaRange extends ElysiaElement {
	static override Tag = "elysia-range";

	static styles = css`
        .slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            cursor: pointer;
            outline: none;
            overflow: hidden;
            border-radius: 16px;
        }

        .slider::-webkit-slider-runnable-track {
            height: 20px;
            background: var(--elysia-color-aro);
            border-radius: 16px;
        }

        .slider::-moz-range-track {
            height: 25px;
            background: var(--elysia-color-aro);
            border-radius: 16px;
        }

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 20px;
            width: 20px;
            background-color: var(--elysia-color-cullen);
            border-radius: 50%;
            border: 2px solid var(--elysia-color-aro);
            box-shadow: -9999px 0 0 9990px var(--elysia-color-aro);
        }

        .slider::-moz-range-thumb {
            height: 25px;
            width: 25px;
            background-color: var(--elysia-color-foreground);
            border-radius: 50%;
            border: 1px solid var(--elysia-color-selection);
            box-shadow: -9997px 0 0 9990px var(--elysia-color-selection);
        }
		
		.value-wrap {
			display: flex;
			justify-content: space-between;
			margin-top: 0.5rem;
			font-family: var(--elysia-font-family);
			font-size: .5rem;
		}
		
		.val {
			font-size: .75rem;
			color: var(--elysia-color-purple);
		}
	`

	@attribute() accessor value = "0";

	@attribute() accessor min = "0";

	@attribute() accessor max = "100";

	@attribute() accessor step = "1";

	onChange?: (value: number) => void;

	public override render() {
		return html`
			<div>
				<div class="value-wrap">
					<span>${this.min}</span>
					<span class="val">${this.value}</span>	
					<span>${this.max}</span>
				</div>
				<input
				type="range"
				value="${this.value}"
				min="${this.min}"
				max="${this.max}"
				step="${this.step}"
				class="slider"
				@input=${this.#onInput}
			>
			</div>
			
		`;
	}

	#onInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		this.value = value;
		if (this.onChange) this.onChange(Number(value));
	}
}

defineComponent(ElysiaRange);

export class ElysiaVector extends ElysiaElement {
	static override Tag = "elysia-vector";

	static styles = css`
		elysia-number-input::part(input) {
			max-width: 50px;
		}
	`

	@attribute() accessor x = "0";

	@attribute() accessor y = "0";

	@attribute() accessor z = "0";

	@attribute() accessor w = "0";

	onChange?: (x: number, y: number, z: number) => void;

	public override render() {
		return html`
			<elysia-number-input value="${this.x}" @change=${this.#onChangeX}></elysia-number-input>
			<elysia-number-input value="${this.y}" @change=${this.#onChangeY}></elysia-number-input>
			<elysia-number-input value="${this.z}" @change=${this.#onChangeZ}></elysia-number-input>
			<elysia-number-input value="${this.w}" @change=${this.#onChangeW}></elysia-number-input>
		`;
	}

	#onChangeX = (value: number) => {
		this.x = value.toString();
		if (this.onChange) this.onChange(Number(this.x), Number(this.y), Number(this.z));
	}

	#onChangeY = (value: number) => {
		this.y = value.toString();
		if (this.onChange) this.onChange(Number(this.x), Number(this.y), Number(this.z));
	}

	#onChangeZ = (value: number) => {
		this.z = value.toString();
		if (this.onChange) this.onChange(Number(this.x), Number(this.y), Number(this.z));
	}

	#onChangeW = (value: number) => {
		this.w = value.toString();
		if (this.onChange) this.onChange(Number(this.x), Number(this.y), Number(this.z));
	}
}

defineComponent(ElysiaVector);

export class ElysiaEnum extends ElysiaElement
{
	static override Tag = "elysia-enum";

	static styles = css`
		select {
			padding: 0.5em 1em;
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

	public override render()
	{
		return html`
			<select @change=${this.#onChange}>
				${this.options.map(option => html`<option value="${option}" ?selected=${option === this.value}>${option}</option>`)}
			</select>
		`;
	}

	#onChange = (e: Event) =>
	{
		this.value = (e.target as HTMLSelectElement).value;
		if(this.onChange) this.onChange(this.value);
	}
}

defineComponent(ElysiaEnum);

export class ElysiaColorPicker extends ElysiaElement
{
	static override Tag = "elysia-color-picker";

	static styles = css`
		button {
			padding: 1.25em 1.25em;
			border: none;
			border-radius: 1rem;
			user-select: none;
		}
		
		#swatch {
			background: var(--elysia-color-aro);
			border: none;
			border-radius: 12px;
			padding: 1rem;
			filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
			border: 1px solid var(--elysia-color-voncount);
		}
		
		.color-text {
			font-family: var(--elysia-font-family);
			font-size: 0.75rem;
			color: var(--elysia-color-pink)
		}
		
		.flexer {
			display: flex;
			justify-content: space-between;
		}
		
		button {
			cursor: pointer;
		}
	`

	@query("#picker") accessor picker: Element | null = null;

	open = false;

	color = "#FF55A7";

	public override render()
	{
		return html`
			<button popovertarget="swatch" style=${`background: ${this.color}`}></button>
			<div id="swatch" popover>
				<div class="flexer">
					<div class="color-text">color</div>
					<div class="color-text" style=${`color: ${this.color}`}>${this.color}</div>
				</div>
				<corel-color-picker id="picker" @change=${this.#onInput} value=${this.color}><corel-color-picker>
			</div>
		`;
	}

	#onInput = (e: Event) =>
	{
		this.color = (this.picker as HTMLInputElement).value;
	}
}

defineComponent(ElysiaColorPicker);