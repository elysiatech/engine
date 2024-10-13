import { ElysiaElement } from "./UI";
export declare class ElysiaTheme extends ElysiaElement {
    #private;
    static Tag: string;
    accessor cullen: any;
    accessor nosferatu: any;
    accessor vonCount: any;
    accessor aro: any;
    accessor red: any;
    accessor orange: any;
    accessor yellow: any;
    accessor green: any;
    accessor purple: any;
    accessor cyan: any;
    accessor pink: any;
    accessor font: string;
    connectedCallback(): void;
    onRender(): any;
    attributeChangedCallback(name: string, _old: string | null, value: string | null): void;
    onMount(): void;
}
