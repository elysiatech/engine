declare const ExitCurrentState: unique symbol;
declare const onEnter: unique symbol;
declare const onExit: unique symbol;
declare const onUpdate: unique symbol;
declare const Actions: unique symbol;
declare const To: unique symbol;
declare const From: unique symbol;
declare const Condition: unique symbol;
declare const GetMatchingTransition: unique symbol;
declare const RunTransition: unique symbol;
declare const ProvidedUpdate: unique symbol;
interface StateConstructorArguments {
    /**
     * Function to be called when the state is entered.
     */
    onEnter?: () => void;
    /**
     * Function to be called when the state is exited.
     */
    onExit?: () => void;
    /**
     * Function to be called when the state is updated.
     */
    onUpdate?: (delta: number, elapsed: number) => void;
    /**
     * Actions that can be called on the state.
     */
    actions?: Record<string, Function>;
}
/**
 * Represents a state in a finite state machine.
 */
declare class State {
    constructor(args: StateConstructorArguments);
    /**
     * Adds an action to the state. This function will be triggered if the state is active
     * when `fsm.callAction` function is called with the same action name.
     * @param action
     * @param callback
     */
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
    /**
     * The state to transition to.
     */
    to: string;
    /**
     * The state to transition from. If omitted, the transition will be considered global.
     */
    from?: string;
    /**
     * The condition to be met for the transition to occur. If a string is provided, it will be treated as an event.
     */
    condition?: Function | string;
}
/**
 * Represents a transition in a finite state machine.
 */
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
/**
 * Represents a finite state machine. Can be used to create complex hierarchical state.
 * The machine can be used with both a polling approach by calling onUpdate(), and an event based approach
 * by calling fireEvent().
 */
export declare class FiniteStateMachine {
    constructor(args?: FiniteStateMachineConstructorArguments);
    /**
     * Initializes the state machine.
     */
    init(): this;
    /**
     * Updates the state machine and runs it's logic.
     * @param delta
     * @param elapsed
     */
    onUpdate(delta: number, elapsed: number): void;
    /**
     * Adds a state to the state machine.
     * @param name
     * @param state
     */
    addState(name: string, state: State | FiniteStateMachine | StateConstructorArguments): this;
    /**
     * Adds a transition to the state machine.
     * If the from field is omitted the transition will be considered global, meaning
     * it can be triggered from any state and has a higher priority than transitions with a `from` field.
     * @param transition
     */
    addTransition(transition: Transition | TransitionConstructorArguments): this;
    /**
     * Adds a two way transition to the state machine. This is a convenience method for adding two transitions at once,
     * with opposing conditions.
     * @param from
     * @param to
     * @param condition
     */
    addTwoWayTransition(from: string, to: string, condition?: Function | string): this;
    /**
     * Get the active hierarchy path of the state machine.
     */
    getActiveHierarchyPath(): string[];
    /**
     * Set the state of the state machine directly.
     * @param name
     */
    setState(name: string): this;
    /**
     * Call an action on the current state.
     * @param action
     * @param recurse
     */
    callAction(action: string, recurse?: boolean): this;
    /**
     * Fire an event on the state machine.
     * @param event
     */
    fireEvent(event: string): this;
    private startingState?;
    private currentState;
    private nextState?;
    private initialized;
    private transitionPending;
    private states;
    private transitions;
    private globalTransitions;
    private eventTransitions;
    private readonly [ProvidedUpdate]?;
    /** @internal */
    [Actions]: Map<string, Function>;
    /** @internal */
    [onEnter]?: () => void;
    /** @internal */
    [onExit]?: () => void | Promise<void>;
    /** @internal */
    [ExitCurrentState](): void | Promise<void>;
    private [RunTransition];
    /** @internal */
    [onUpdate](delta: number, elapsed: number): void;
    /** @internal */
    [GetMatchingTransition](): Transition | undefined;
}
export {};
