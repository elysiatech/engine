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

interface StateConstructorArguments
{
	onEnter?: () => void;
	onExit?: () => void;
	onUpdate?: (delta: number, elapsed: number) => void;
	actions?: Record<string, Function>;
}

class State {

	constructor(args: StateConstructorArguments)
	{
		this[onEnter] = args.onEnter;
		this[onExit] = args.onExit;
		this[onUpdate] = args.onUpdate;
		this[Actions] = new Map(Object.entries(args.actions ?? {}));
	}

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
	to: string;
	from?: string;
	condition?: Function | string;
}

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

export class FiniteStateMachine
{
	constructor(args: FiniteStateMachineConstructorArguments = {})
	{
		this[onEnter] = args.onEnter;
		this[onExit] = args.onExit;
		this.providedUpdate = args.onUpdate;
	}

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

	public onUpdate(delta: number, elapsed: number)
	{
		this[onUpdate]?.(delta, elapsed);
	}

	public addState(name: string, state: State | FiniteStateMachine | StateConstructorArguments): this
	{
		if(!(state instanceof State) && !(state instanceof FiniteStateMachine))
			state = new State(state);

		this.states.set(name, state as State | FiniteStateMachine);
		if(!this.startingState) this.startingState = name;

		return this;
	}

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

	public setState(name: string): this
	{
		this.runTransition(this.states.getKey(this.currentState)!, name)
		return this;
	}

	public callAction(action: string, recurse = true): this
	{
		if(this.currentState[Actions].has(action))
			this.currentState[Actions].get(action)!();

		if(this.currentState instanceof FiniteStateMachine && recurse)
			this.currentState.callAction(action, recurse);

		return this;
	}

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
					this.runTransition(transition[From], transition[To]);
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

	private eventTransitions = new ReverseMap<string, Set<Transition>>;

	private readonly providedUpdate?: (delta: number, elapsed: number) => void;

	private runTransition(from: string | undefined, to: string)
	{
		const toState = this.states.get(to);

		if(!toState)
		{
			ELYSIA_LOGGER.error("Invalid state transition.");
			return;
		}

		this.nextState = toState;

		if(this.transitionPending) return;

		const maybePromise = this[ExitCurrentState]()

		if(maybePromise instanceof Promise)
		{
			maybePromise.then(() => {
				this.currentState = this.nextState!;
				this.nextState = undefined;
				this.currentState[onEnter]?.();
				if(this.currentState instanceof FiniteStateMachine) this.currentState.init();
			})
		}
		else
		{
			this.currentState = this.nextState!;
			this.nextState = undefined;
			this.currentState[onEnter]?.();
			if(this.currentState instanceof FiniteStateMachine) this.currentState.init();
		}
	}

	/** @internal */
	[Actions] = new Map<string, Function>();

	/** @internal */
	[onEnter]?: () => void;

	/** @internal */
	[onExit]?: () => void | Promise<void>;

	/** @internal */
	[ExitCurrentState]()
	{
		if(this.currentState instanceof FiniteStateMachine) this.currentState[ExitCurrentState]();
		this.transitionPending = true;
		const maybePromise = this.currentState[onExit]?.();
		if(maybePromise instanceof Promise)
		{
			return maybePromise.then(() => {
				this.transitionPending = false;
				this.currentState = this.states.get(this.startingState!)!;
			})
		}
		this.transitionPending = false;
		this.currentState = this.states.get(this.startingState!)!;
	}

	/** @internal */
	[onUpdate](delta: number, elapsed: number)
	{
		if(!this.initialized) return;

		for(const transition of this.transitions)
		{
			let shouldTransition = false;

			if(transition[From])
			{
				shouldTransition = this.states.getKey(this.nextState ?? this.currentState) === transition[From];
			}
			else if(typeof transition[From] === 'undefined')
			{
				shouldTransition = true;
			}

			if(!shouldTransition) continue;

			if(
				(typeof transition[Condition] === "function" && transition[Condition]())
				|| typeof transition[Condition] === undefined
			)
			{
				this.runTransition(transition[From], transition[To]);
				break;
			}
		}

		this.providedUpdate?.(delta, elapsed);
		this.currentState?.[onUpdate]?.(delta, elapsed);
	}
}
