import { css, html, LitElement, PropertyDeclaration, PropertyValueMap, svg, TemplateResult } from "lit";
import { defaultScheduler, Scheduler } from "./Scheduler";
import { Constructor, tick } from "../Core/Utilities";
import { isFunction } from "../Core/Asserts";
import { property } from "lit/decorators/property.js";

export {
	css, 
	css as c,
	svg,
	svg as s,
	html,
	html as h,
	defineComponent,
	Scheduler,
	defaultScheduler,
	ElysiaElement,
	OffscreenUpdateStrategy
};

const isLitTemplateResult = (value: unknown): value is TemplateResult => !!value && (typeof value === "object") && ("_$litType$" in value);

function defineComponent(component: Constructor<ElysiaElement> & { Tag: string })
{
	if(!component.Tag || component.Tag === "unknown-elysia-element")
	{
		throw new Error(`You must define a tag for ${component.name}!`)
	}
	if(!customElements.get(component.Tag))
	{
		customElements.define(component.Tag, component);
	}
}

const strictEqual = (a: any, b: any) => a === b;

function attribute(options: {
	reflect?: boolean,
	converter?: PropertyDeclaration["converter"],
	attribute?: string,
	onChange?: (value: any) => void ,
	hasChanged?: PropertyDeclaration["hasChanged"]
} = {})
{
	return property({
		attribute: options.attribute ?? true,
		reflect: options.reflect,
		converter: options.converter,
		hasChanged(value: unknown, oldValue: unknown): boolean
		{
			const hasChanged = (options.hasChanged ?? strictEqual)(value, oldValue);
			if(hasChanged && options.onChange) options.onChange(value);
			return hasChanged;
		}
	})
}

/**
 * Base class for creating custom elements
 * */
interface ElysiaElement extends LitElement
{
	/**
	 * Schedule a possible update, if it's template values have changed.
	 * If you want to force an update, you can call requestUpdate().
	 */
	requestRender(): void;

	/**
	 * Set the offscreen update strategy for this element.
	 * @default OffscreenUpdateStrategy.Disabled
	 * @param strategy
	 */
	setOffscreenRenderStrategy(strategy: OffscreenUpdateStrategy): void;

	/**
	 * The scheduler that this element is subscribed to.
	 */
	scheduler: Scheduler;

	/**
	 * Lifecycle hook that is called when the element is mounted to the DOM.
	 */
	onMount?(): void;

	/**
	 * Lifecycle hook that is called before the element is updated.
	 */
	onBeforeUpdate?(): void;

	/**
	 * Lifecycle hook that is called after the element is updated.
	 */
	onAfterUpdate?(): void;

	/**
	 * Lifecycle hook that is called when the element is unmounted from the DOM.
	 */
	onUnmount?(): void;
}

enum OffscreenUpdateStrategy
{
	Disabled,
	HighPriority
}

class ElysiaElement extends LitElement
{
	public static Tag: string = "unknown-elysia-element";

	public scheduler: Scheduler = defaultScheduler;

	public get offscreen(){ return this.#offscreen; }

	public get offscreenUpdateStrategy(): OffscreenUpdateStrategy { return this.#offscreenUpdateStrategy; }

	public constructor()
	{
		super();
		this.#providedRenderFunction = this.render as any;
		this.render = function render(){ return this.#renderResult ?? this.#providedRenderFunction() }

		this.compareRenderOutput = this.compareRenderOutput.bind(this);
		this.requestRender = this.requestRender.bind(this);
	}

	override connectedCallback()
	{
		super.connectedCallback();
		this.onMount && this.onMount();

		this.componentVisibilityObserver = new IntersectionObserver((entries) =>
		{
			if(entries.some(entry => entry.isIntersecting))
			{
				this.#offscreen = false;
				this.scheduler.subscribe(this)
			}
			else
			{
				this.#offscreen = true;
				this.setOffscreenUpdateStrategy(this.offscreenUpdateStrategy)
			}
		}, {
			rootMargin: "25px"
		})

		this.componentVisibilityObserver.observe(this)
	}

	override disconnectedCallback(): void
	{
		super.disconnectedCallback();
		this.scheduler.unsubscribe(this);
		this.componentVisibilityObserver?.disconnect();
		this.onUnmount && this.onUnmount();
	}

	public requestRender()
	{
		if(this.isUpdatePending) return;

		const currentRender = this.#providedRenderFunction();

		if (isLitTemplateResult(currentRender))
		{
			if (
				!this.#renderResult
				|| this.compareRenderOutput(this.#renderResult.values, currentRender.values)
				|| this.compareRenderOutput(this.#renderResult.strings, currentRender.strings)
			)
			{
				this.#renderResult = currentRender;
				this.requestUpdate();
				this.onBeforeUpdate && this.onBeforeUpdate();
			}
		}
		else { throw Error("ImHTML render method must return a lit-html template result"); }
	}

	public setOffscreenUpdateStrategy(value: OffscreenUpdateStrategy)
	{
		this.#offscreenUpdateStrategy = value;

		if(this.offscreen)
		{
			if(value === OffscreenUpdateStrategy.Disabled) this.scheduler.unsubscribe(this);
			if(value === OffscreenUpdateStrategy.HighPriority) this.scheduler.subscribe(this);
		}
	}

	protected componentVisibilityObserver?: IntersectionObserver;

	protected override updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void
	{
		super.updated(_changedProperties);
		this.onAfterUpdate && this.onAfterUpdate();
	}

	private compareRenderOutput(a: unknown[] | TemplateStringsArray, b: unknown[] | TemplateStringsArray): boolean
	{
		// if the lengths are different, we know the values are different and bail early
		if (a?.length !== b?.length) return true;

		for (let i = 0; i < a?.length; i++)
		{
			const prev = a[i], next = b[i];

			// functions are compared by name
			if (isFunction(prev) && isFunction(next))
			{
				if (prev.name !== next.name) return true;
				else continue;
			}

			// lit template results are compared by their values
			if (isLitTemplateResult(prev) && isLitTemplateResult(next))
			{
				return this.compareRenderOutput(prev.values, next.values) && this.compareRenderOutput(prev.strings, next.strings);
			}

			// arrays are deeply compared
			if (Array.isArray(prev) && Array.isArray(next)) return this.compareRenderOutput(prev, next);

			// strict equality check
			if (a[i] !== b[i]) return true;
		}

		return false;
	}

	readonly #providedRenderFunction: () => TemplateResult;

	#renderResult?: TemplateResult;

	#offscreen = true;

	#offscreenUpdateStrategy: OffscreenUpdateStrategy = OffscreenUpdateStrategy.Disabled;
}
