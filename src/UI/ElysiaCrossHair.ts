import { LitElement, nothing, html, css } from "lit";
import { property } from "lit/decorators/property.js"

const c = (...args: any[]) => args.filter(Boolean).join(" ");

export class ElysiaCrossHair extends LitElement
{
	static styles = css`
        :host {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: none;
        }

        .left {
            position: absolute;
            top: 50%;
            left: calc(50% - calc(var(--length) + var(--gap)));
			transform: translate(0, -50%);
            width: var(--length);
            height: var(--thickness);
            background: var(--color);
            outline: black solid var(--outline);
        }

        .right {
            position: absolute;
            top: 50%;
            left: calc(50% + var(--gap));
			transform: translate(0, -50%);
            width: var(--length);
            height: var(--thickness);
            background: var(--color);
			outline: black solid var(--outline);
        }

        .top {
            position: absolute;
            top: calc(50% - calc(var(--length) + var(--gap)));
            left: 50%;
            transform: translate(-50%, 0);
            width: var(--thickness);
            height: var(--length);
            background: var(--color);
            outline: black solid var(--outline);
        }

        .bottom {
            position: absolute;
            top: calc(50% + var(--gap));
            left: 50%;
            transform: translate(-50%, 0);
            width: var(--thickness);
            height: var(--length);
            background: var(--color);
            outline: black solid var(--outline);
        }
		
		.dot {
			position: absolute;
			top: 50%;
			left: 50%;
			width: var(--thickness);
			height: var(--thickness);
			background: var(--color);
			outline: black solid var(--outline);
			transform: translate(-50%, -50%);
		}
	`

	@property({ type: Number, reflect: true }) public accessor gap = 4;
	@property({ type: Number, reflect: true }) public accessor thickness = 2;
	@property({ type: Number, reflect: true }) public accessor length = 8;
	@property({ type: String, reflect: true }) public accessor color = "white";
	@property({ type: Boolean, reflect: true }) public accessor dot = false;
	@property({ type: Boolean, reflect: true }) public accessor outline = false;
	@property({ type: Boolean, reflect: true }) public accessor t = false;
	@property({ type: Boolean, reflect: true }) public accessor visible = true;

	connectedCallback() {
		super.connectedCallback();
		this.updateStyles();
	}

	render()
	{
		if(!this.visible) return nothing;
		return html`
			<div class=${c('left')}></div>
			<div class=${c('right')}></div>
			${this.t ? nothing : html`<div class=${c('top')}></div>`}
			<div class=${c('bottom')}></div>
			${this.dot ? html`<div class="dot"></div>` : nothing}
		`
	}

	private updateStyles()
	{
		this.style.setProperty("--gap", `${this.gap}px`);
		this.style.setProperty("--thickness", `${this.thickness}px`);
		this.style.setProperty("--length", `${this.length}px`);
		this.style.setProperty("--color", this.color);
		this.style.setProperty("--outline", this.outline ? "1px" : "0");
	}
}

customElements.define("elysia-crosshair", ElysiaCrossHair);