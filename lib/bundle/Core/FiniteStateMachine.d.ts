declare const ExitCurrentState: unique symbol;
declare const onEnter: unique symbol;
declare const onExit: unique symbol;
declare const onUpdate: unique symbol;
declare const Actions: unique symbol;
declare const To: unique symbol;
declare const From: unique symbol;
declare const Condition: unique symbol;
interface StateConstructorArguments {
    onEnter?: () => void;
    onExit?: () => void;
    onUpdate?: (delta: number, elapsed: number) => void;
    actions?: Record<string, Function>;
}
declare class State {
    constructor(args: StateConstructorArguments);
    addAction(action: string, callback: Function): void;
    /** @internal */
    [Actions]: Map<string, Function>;
    /** @internal */
    [onEnter]?: () => void;
    /** @internal */
    [onExit]?: () => void | Promise<void>;
    /** @internal */
    [onUpdate]?: (delta: number, elapsed: number) => void;
}
interface TransitionConstructorArguments {
    to: string;
    from?: string;
    condition?: Function | string;
}
export declare class Transition {
    constructor(to: string, from: string | undefined, condition?: Function | string);
    /** @internal */
    [To]: string;
    /** @internal */
    [From]?: string;
    /** @internal */
    [Condition]?: Function | string;
}
export interface FiniteStateMachineConstructorArguments {
    onEnter?: () => void;
    onExit?: () => void;
    onUpdate?: (delta: number, elapsed: number) => void;
}
export declare class FiniteStateMachine {
    constructor(args?: FiniteStateMachineConstructorArguments);
    init(): this;
    onUpdate(delta: number, elapsed: number): void;
    addState(name: string, state: State | FiniteStateMachine | StateConstructorArguments): this;
    addTransition(transition: Transition | TransitionConstructorArguments): this;
    setState(name: string): this;
    callAction(action: string, recurse?: boolean): this;
    fireEvent(event: string): this;
    private startingState?;
    private currentState;
    private nextState?;
    private initialized;
    private transitionPending;
    private states;
    private transitions;
    private eventTransitions;
    private readonly providedUpdate?;
    private runTransition;
    /** @internal */
    [Actions]: Map<string, Function>;
    /** @internal */
    [onEnter]?: () => void;
    /** @internal */
    [onExit]?: () => void | Promise<void>;
    /** @internal */
    [ExitCurrentState](): Promise<void> | undefined;
    /** @internal */
    [onUpdate](delta: number, elapsed: number): void;
}
export {};
