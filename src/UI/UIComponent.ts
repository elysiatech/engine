import { CSSResult, TemplateResult } from "lit";
import { css, ElysiaElement, html } from "./UI";
import { Constructor } from "../Core/Utilities";

export interface IUIComponent {
	styles?(c: typeof css): CSSResult,
	render(h: typeof html): TemplateResult,
	onMount?(): void,
	onUnmount?(): void
}

export function createUI(component: IUIComponent): Constructor<ElysiaElement> {
	return class extends ElysiaElement {
		static styles = component.styles?.(css) ?? css``;
		onMount() { component.onMount?.(); }
		onUnmount() { component.onUnmount?.(); }
		render() { return component.render(html); }
	}
}