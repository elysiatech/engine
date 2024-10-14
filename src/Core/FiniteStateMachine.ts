import { ReverseMap } from "../Containers/ReverseMap.ts";
import { ELYSIA_LOGGER } from "./Logger.ts";

const ExitCurrentState = Symbol.for("Elysia::FiniteStateMachine::ExitCurrentState");
const onEnter = Symbol.for("Elysia::FiniteStateMachine::onEnter");
const onExit = Symbol.for("Elysia::FiniteStateMachine::onExit");
const onUpdate = Symbol.for("Elysia::FiniteStateMachine::onUpdate");
const Actions = Symbol.for("Elysia::FiniteStateMachine::Actions");
const To = Symbol.for("Elysia::FiniteStateMachine::To");
const From = Symbol.for("Elysia::FiniteStateMachine::From");
const Condition = Symbol.for("Elysia::FiniteStateMachine::Condition");
const GetMatchingTransition = Symbol.for("Elysia::FiniteStateMachine::GetMatchingTransition");
const RunTransition = Symbol.for("Elysia::FiniteStateMachine::RunTransition");
const ProvidedUpdate = Symbol.for("Elysia::FiniteStateMachine::providedUpdate");

interface StateConstructorArguments
{
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
class State
{
	constructor(args: StateConstructorArguments)
	{
		this[onEnter] = args.onEnter;
		this[onExit] = args.onExit;
		this[onUpdate] = args.onUpdate;
		this[Actions] = new Map(Object.entries(args.actions ?? {}));
	}

	/**
	 * Adds an action to the state. This function will be triggered if the state is active
	 * when `fsm.callAction` function is called with the same action name.
	 * @param action
	 * @param callback
	 */
	public addAction(action: string, callback: Function) { this[Actions].set(action, callback); }

	/** @internal */
	[Actions]: Map<string, Function>;
	/** @internal */
	[onEnter]?: () => void;
	/** @internal */
	[onExit]?: () => void | Promise<void>;
	/** @internal */
	[onUpdate]?: (delta: number, elapsed: number) => void;
}

interface TransitionConstructorArguments
{
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
export class Transition
{
	constructor(to: string, from: string | undefined, condition?: Function | string)
	{
		this[To] = to;
		this[From] = from;
		this[Condition] = condition;
	}

	/** @internal */
	[To]: string;
	/** @internal */
	[From]?: string;
	/** @internal */
	[Condition]?: Function | string;
}

export interface FiniteStateMachineConstructorArguments
{
	onEnter?: () => void;
	onExit?: () => void;
	onUpdate?: (delta: number, elapsed: number) => void;
}

/**
 * Represents a finite state machine. Can be used to create complex hierarchical state.
 * The machine can be used with both a polling approach by calling onUpdate(), and an event based approach
 * by calling fireEvent().
 */
export class FiniteStateMachine
{
	constructor(args: FiniteStateMachineConstructorArguments = {})
	{
		this[onEnter] = args.onEnter;
		this[onExit] = args.onExit;
		this[ProvidedUpdate] = args.onUpdate;
	}

	/**
	 * Initializes the state machine.
	 */
	public init(): this
	{
		if(!this.startingState)
		{
			ELYSIA_LOGGER.error("No starting state provided for FiniteStateMachine.");
			return this;
		}
		this.currentState = this.states.get(this.startingState)!;
		this[onEnter]?.();
		this.currentState?.[onEnter]?.();
		this.initialized = true;

		if(this.currentState instanceof FiniteStateMachine) this.currentState.init();

		return this;
	}

	/**
	 * Updates the state machine and runs it's logic.
	 * @param delta
	 * @param elapsed
	 */
	public onUpdate(delta: number, elapsed: number)
	{
		this[onUpdate]?.(delta, elapsed);
	}

	/**
	 * Adds a state to the state machine.
	 * @param name
	 * @param state
	 */
	public addState(name: string, state: State | FiniteStateMachine | StateConstructorArguments): this
	{
		if(!(state instanceof State) && !(state instanceof FiniteStateMachine))
			state = new State(state);

		this.states.set(name, state as State | FiniteStateMachine);
		if(!this.startingState) this.startingState = name;

		return this;
	}

	/**
	 * Adds a transition to the state machine.
	 * If the from field is omitted the transition will be considered global, meaning
	 * it can be triggered from any state and has a higher priority than transitions with a `from` field.
	 * @param transition
	 */
	public addTransition(transition: Transition | TransitionConstructorArguments): this
	{
		if(!(transition instanceof Transition))
			transition = new Transition(transition.to, transition.from, transition.condition);
		if(typeof transition[Condition] === "string")
			if(!this.eventTransitions.has(transition[Condition]))
				this.eventTransitions.set(transition[Condition], new Set([transition]));
			else this.eventTransitions.get(transition[Condition])!.add(transition);
		else this.transitions.add(transition);

		return this;
	}

	/**
	 * Adds a two way transition to the state machine. This is a convenience method for adding two transitions at once,
	 * with opposing conditions.
	 * @param from
	 * @param to
	 * @param condition
	 */
	public addTwoWayTransition(from: string, to: string, condition?: Function | string): this
	{
		const conditionFunction = typeof condition === 'function' && condition;

		this.addTransition({ to, from, condition: conditionFunction ? conditionFunction : condition });
		this.addTransition({ to: from, from: to, condition: conditionFunction ? () => !conditionFunction() : condition });
		return this;
	}

	/**
	 * Get the active hierarchy path of the state machine.
	 */
	public getActiveHierarchyPath()
	{
		const path = [this.states.getKey(this.currentState)!];
		let current = this.currentState;
		while(current instanceof FiniteStateMachine)
		{
			const state = current.states.getKey(current.currentState)!;
			path.push(state);
			current = current.currentState;
		}
		return path;
	}

	/**
	 * Set the state of the state machine directly.
	 * @param name
	 * @param instant If true, the state will be set without waiting for an exit function.
	 */
	public setState(name: string, instant = false): this
	{
		const to = this.states.get(name);
		if(!to) ELYSIA_LOGGER.error("Invalid state.");
		else
		{
			if(!instant)
				this[RunTransition](this.states.getKey(this.currentState), name)
			else
			{
				this[ExitCurrentState]();
				this.currentState = to;
				this.currentState[onEnter]?.();
			}
		}
		return this;
	}

	/**
	 * Call an action on the current state.
	 * @param action
	 * @param recurse
	 */
	public callAction(action: string, recurse = true): this
	{
		if(this.currentState[Actions].has(action))
			this.currentState[Actions].get(action)!();

		if(this.currentState instanceof FiniteStateMachine && recurse)
			this.currentState.callAction(action, recurse);

		return this;
	}

	/**
	 * Fire an event on the state machine.
	 * @param event
	 */
	public fireEvent(event: string): this
	{
		if(this.eventTransitions.has(event))
		{
			for(const transition of this.eventTransitions.get(event)!)
			{
				if(
					(typeof transition[Condition] === "function" && transition[Condition]())
					|| typeof transition[Condition] === undefined
				)
				{
					this[RunTransition](transition[From], transition[To]);
					break;
				}
			}
		}
		return this;
	}

	private startingState?: string;

	private currentState!: State | FiniteStateMachine;

	private nextState?: State | FiniteStateMachine;

	private initialized = false;

	private transitionPending = false;

	private states = new ReverseMap<string, State | FiniteStateMachine>();

	private transitions = new Set<Transition>();

	private globalTransitions = new Set<Transition>();

	private eventTransitions = new ReverseMap<string, Set<Transition>>;

	private readonly [ProvidedUpdate]?: (delta: number, elapsed: number) => void;

	/** @internal */
	[Actions] = new Map<string, Function>();

	/** @internal */
	[onEnter]?: () => void;

	/** @internal */
	[onExit]?: () => void | Promise<void>;

	/** @internal */
	[ExitCurrentState](): void | Promise<void>
	{
		if(this.currentState instanceof FiniteStateMachine) this.currentState[ExitCurrentState]();
		return this.currentState[onExit]?.();
	}

	private [RunTransition](from: string | undefined, to: string)
	{
		const toState = this.states.get(to);

		if(!toState)
		{
			ELYSIA_LOGGER.error("Invalid state transition.");
			return;
		}

		this.nextState = toState;

		if(this.transitionPending) return;

		this.transitionPending = true;

		const maybePromise = this[ExitCurrentState]()

		const onComplete = () => {
			this.currentState = this.nextState!;
			this.nextState = undefined;
			this.transitionPending = false;
			if(this.currentState instanceof FiniteStateMachine) this.currentState.init();
			else this.currentState[onEnter]?.();
		}

		if(maybePromise instanceof Promise) maybePromise.then(onComplete)
		else onComplete();
	}

	/** @internal */
	[onUpdate](delta: number, elapsed: number)
	{
		if(!this.initialized) return;

		const transition = this[GetMatchingTransition]();

		if(transition) this[RunTransition](transition[From], transition[To]);

		this[ProvidedUpdate]?.(delta, elapsed);
		this.currentState[onUpdate]?.(delta, elapsed);
	}

	/** @internal */
	[GetMatchingTransition](): Transition | undefined
	{
		for(const transition of this.globalTransitions)
			if(typeof transition[Condition] === "function" && transition[Condition]()) return transition;

		for(const transition of this.transitions)
		{
			if(
				transition[From] &&
				// if there is a next state, it means we are currently transitioning
				// so we use that state for the from comparison
				this.states.getKey(this.nextState ?? this.currentState) === transition[From] &&
				(typeof transition[Condition] === "function" && transition[Condition]())
				|| typeof transition[Condition] === undefined
			) return transition;
		}
	}
}
