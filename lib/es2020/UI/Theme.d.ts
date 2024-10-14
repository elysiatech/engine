import { ElysiaElement } from "./UI.ts";
export declare class ElysiaTheme extends ElysiaElement {
    #private;
    static Tag: string;
    accessor cullen: string;
    accessor nosferatu: string;
    accessor vonCount: string;
    accessor aro: string;
    accessor red: string;
    accessor orange: string;
    accessor yellow: string;
    accessor green: string;
    accessor purple: string;
    accessor cyan: string;
    accessor pink: string;
    accessor font: string;
    connectedCallback(): void;
    onRender(): import("lit").TemplateResult<1>;
    attributeChangedCallback(name: string, _old: string | null, value: string | null): void;
    onMount(): void;
}
