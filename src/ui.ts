import { LitElement, TemplateResult, html, css, svg, PropertyValueMap, PropertyDeclaration } from "lit";
import { property, query } from "lit/decorators.js";

/****************************************************************************************
 * Exports
 *****************************************************************************************/

export { 
	query as ref,
	css, 
	css as c,
	svg,
	svg as s,
	html,
	html as h,
	attribute,
	defineComponent,
	Scheduler,
	defaultScheduler,
	ElysiaElement,
	OffscreenUpdateStrategy
};

/****************************************************************************************
 * Utils
 *****************************************************************************************/

type Constructor<T = {}> = new (...args: any[]) => T;

const isLitTemplateResult = (value: unknown): value is TemplateResult => {
	return !!value && (typeof value === "object") && ("_$litType$" in value);
}

const isFn = (value: unknown): value is Function => {
	return typeof value === "function";
}

function defineComponent(component: Constructor<ElysiaElement> & { Tag: string }){
	if(!component.Tag || component.Tag === "elysia-element"){
		throw new Error(`You must define a tag for ${component.name}!`)
	}
	if(!customElements.get(component.Tag)){
		customElements.define(component.Tag, component);
	}
}

/****************************************************************************************
 * Decorators
 *****************************************************************************************/

function attribute(options: { 
	reflect?: boolean, 
	converter?: PropertyDeclaration["converter"], 
	attribute?: string 
} = {}){
	return property({ 
		attribute: options.attribute ?? true, 
		reflect: options.reflect, 
		converter: options.converter })}

/****************************************************************************************
 * Scheduler
 *****************************************************************************************/

class Scheduler {

	frametime: number = 0;

	components = new Set<ElysiaElement>;

	subscribe(component: ElysiaElement) {
		this.components.add(component);
	}

	unsubscribe(component: ElysiaElement) {
		this.components.delete(component);
	}

	update() {
		const t = performance.now();
		for (const component of this.components) {
			component.requestRender();
		}
		this.frametime = Math.round(((performance.now() - t) + Number.EPSILON) * 100) / 100
	}
}

const defaultScheduler = new Scheduler;

if (typeof document !== "undefined") {
	const render = () => {
		requestAnimationFrame(render)
		defaultScheduler.update()
	}
	requestAnimationFrame(render)
}

/****************************************************************************************
 * ImHtmlElement
 *****************************************************************************************/

/**
 * Base class for creating custom elements
 * */
interface ElysiaElement extends LitElement {
	requestUpdate(): void;
	requestRender(): void;
	setOffscreenRenderStrategy(strategy: OffscreenUpdateStrategy): void;
	scheduler: Scheduler;

	onMount?(): void;
	onBeforeUpdate?(): void;
	onAfterUpdate?(): void;
	onUnmount?(): void;
}

enum OffscreenUpdateStrategy {
	Disabled,
	HighPriority
}

class ElysiaElement extends LitElement{

	static Tag: string = "elysia-element";

	public scheduler: Scheduler = defaultScheduler;

	get offscreen(){
		return this.#offscreen;
	}

	get offscreenUpdateStrategy(): OffscreenUpdateStrategy {
		return this.#offscreenUpdateStrategy;
	}

	constructor(){
		super();
		this.providedRenderFunction = this.render as any;
		this.render = function render(){ return this.renderResult ?? this.providedRenderFunction() }
	}

	connectedCallback() {
		super.connectedCallback();
		this.onMount && this.onMount();
		this.observer.observe(this)
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.scheduler.unsubscribe(this);
		this.observer.disconnect();
		this.onUnmount && this.onUnmount();
	}

	requestRender() {
		if(this.isUpdatePending) return;

		const currentRender = this.providedRenderFunction();

		if (isLitTemplateResult(currentRender)) {		
			if (
				!this.renderResult 
				|| this.compareRenderOutput(this.renderResult.values, currentRender.values)
				|| this.compareRenderOutput(this.renderResult.strings, currentRender.strings)
			) {
				this.renderResult = currentRender;
				this.requestUpdate();
				this.onBeforeUpdate && this.onBeforeUpdate();
			}
		} else {
			throw Error("ImHTML render method must return a lit-html template result");
		}
	}

	setOffscreenUpdateStrategy(value: OffscreenUpdateStrategy) {
		this.#offscreenUpdateStrategy = value;

		if(this.offscreen){
			if(value === OffscreenUpdateStrategy.Disabled){
				this.scheduler.unsubscribe(this);
			}
			if(value === OffscreenUpdateStrategy.HighPriority){
				this.scheduler.subscribe(this);
			}
		}
	}

	protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.updated(_changedProperties);
		this.onAfterUpdate && this.onAfterUpdate();
	}

	private providedRenderFunction: () => TemplateResult;

	private renderResult?: TemplateResult;

	private observer = new IntersectionObserver((entries) => {
		if(entries.some(entry => entry.isIntersecting)){
			this.#offscreen = false;
			this.scheduler.subscribe(this)
		} else {
			this.#offscreen = true;
			this.setOffscreenUpdateStrategy(this.offscreenUpdateStrategy)
		}
	}, {
		rootMargin: "25px"
	})

	private compareRenderOutput(a: unknown[] | TemplateStringsArray, b: unknown[] | TemplateStringsArray): boolean {
		// if the lengths are different, we know the values are different and bail early
		if (a.length !== b.length) {
			return true;
		}

		for (let i = 0; i < a.length; i++) {
			const prev = a[i], next = b[i];

			// functions are compared by name
			if (isFn(prev) && isFn(next)) {
				if (prev.name !== next.name) {
					return true;
				} else {
					continue;
				}
			}

			// lit template results are compared by their values
			if (isLitTemplateResult(prev) && isLitTemplateResult(next)) {
				return this.compareRenderOutput(prev.values, next.values) && this.compareRenderOutput(prev.strings, next.strings);
			}

			// arrays are deeply compared
			if (Array.isArray(prev) && Array.isArray(next)) {
				return this.compareRenderOutput(prev, next);
			}

			// strict equality check
			if (a[i] !== b[i]) {
				return true;
			}
		}

		return false;
	}

	#offscreen = true;

	#offscreenUpdateStrategy: OffscreenUpdateStrategy = OffscreenUpdateStrategy.Disabled;
}


