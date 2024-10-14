import { ReverseMap } from "../Containers/ReverseMap.js";
import { ELYSIA_LOGGER } from "./Logger.js";
const ExitCurrentState = Symbol.for("Elysia::FiniteStateMachine::ExitCurrentState");
const onEnter = Symbol.for("Elysia::FiniteStateMachine::onEnter");
const onExit = Symbol.for("Elysia::FiniteStateMachine::onExit");
const onUpdate = Symbol.for("Elysia::FiniteStateMachine::onUpdate");
const Actions = Symbol.for("Elysia::FiniteStateMachine::Actions");
const To = Symbol.for("Elysia::FiniteStateMachine::To");
const From = Symbol.for("Elysia::FiniteStateMachine::From");
const Condition = Symbol.for("Elysia::FiniteStateMachine::Condition");
class State {
    constructor(args) {
        this[onEnter] = args.onEnter;
        this[onExit] = args.onExit;
        this[onUpdate] = args.onUpdate;
        this[Actions] = new Map(Object.entries(args.actions ?? {}));
    }
    addAction(action, callback) { this[Actions].set(action, callback); }
    /** @internal */
    [Actions];
    /** @internal */
    [onEnter];
    /** @internal */
    [onExit];
    /** @internal */
    [onUpdate];
}
export class Transition {
    constructor(to, from, condition) {
        this[To] = to;
        this[From] = from;
        this[Condition] = condition;
    }
    /** @internal */
    [To];
    /** @internal */
    [From];
    /** @internal */
    [Condition];
}
export class FiniteStateMachine {
    constructor(args = {}) {
        this[onEnter] = args.onEnter;
        this[onExit] = args.onExit;
        this.providedUpdate = args.onUpdate;
    }
    init() {
        if (!this.startingState) {
            ELYSIA_LOGGER.error("No starting state provided for FiniteStateMachine.");
            return this;
        }
        this.currentState = this.states.get(this.startingState);
        this[onEnter]?.();
        this.currentState?.[onEnter]?.();
        this.initialized = true;
        if (this.currentState instanceof FiniteStateMachine)
            this.currentState.init();
        return this;
    }
    onUpdate(delta, elapsed) {
        this[onUpdate]?.(delta, elapsed);
    }
    addState(name, state) {
        if (!(state instanceof State) && !(state instanceof FiniteStateMachine))
            state = new State(state);
        this.states.set(name, state);
        if (!this.startingState)
            this.startingState = name;
        return this;
    }
    addTransition(transition) {
        if (!(transition instanceof Transition))
            transition = new Transition(transition.to, transition.from, transition.condition);
        if (typeof transition[Condition] === "string")
            if (!this.eventTransitions.has(transition[Condition]))
                this.eventTransitions.set(transition[Condition], new Set([transition]));
            else
                this.eventTransitions.get(transition[Condition]).add(transition);
        else
            this.transitions.add(transition);
        return this;
    }
    setState(name) {
        this.runTransition(this.states.getKey(this.currentState), name);
        return this;
    }
    callAction(action, recurse = true) {
        if (this.currentState[Actions].has(action))
            this.currentState[Actions].get(action)();
        if (this.currentState instanceof FiniteStateMachine && recurse)
            this.currentState.callAction(action, recurse);
        return this;
    }
    fireEvent(event) {
        if (this.eventTransitions.has(event)) {
            for (const transition of this.eventTransitions.get(event)) {
                if ((typeof transition[Condition] === "function" && transition[Condition]())
                    || typeof transition[Condition] === undefined) {
                    this.runTransition(transition[From], transition[To]);
                    break;
                }
            }
        }
        return this;
    }
    startingState;
    currentState;
    nextState;
    initialized = false;
    transitionPending = false;
    states = new ReverseMap();
    transitions = new Set();
    eventTransitions = new ReverseMap;
    providedUpdate;
    runTransition(from, to) {
        const toState = this.states.get(to);
        if (!toState) {
            ELYSIA_LOGGER.error("Invalid state transition.");
            return;
        }
        this.nextState = toState;
        if (this.transitionPending)
            return;
        const maybePromise = this[ExitCurrentState]();
        if (maybePromise instanceof Promise) {
            maybePromise.then(() => {
                this.currentState = this.nextState;
                this.nextState = undefined;
                this.currentState[onEnter]?.();
                if (this.currentState instanceof FiniteStateMachine)
                    this.currentState.init();
            });
        }
        else {
            this.currentState = this.nextState;
            this.nextState = undefined;
            this.currentState[onEnter]?.();
            if (this.currentState instanceof FiniteStateMachine)
                this.currentState.init();
        }
    }
    /** @internal */
    [Actions] = new Map();
    /** @internal */
    [onEnter];
    /** @internal */
    [onExit];
    /** @internal */
    [ExitCurrentState]() {
        if (this.currentState instanceof FiniteStateMachine)
            this.currentState[ExitCurrentState]();
        this.transitionPending = true;
        const maybePromise = this.currentState[onExit]?.();
        if (maybePromise instanceof Promise) {
            return maybePromise.then(() => {
                this.transitionPending = false;
                this.currentState = this.states.get(this.startingState);
            });
        }
        this.transitionPending = false;
        this.currentState = this.states.get(this.startingState);
    }
    /** @internal */
    [onUpdate](delta, elapsed) {
        if (!this.initialized)
            return;
        for (const transition of this.transitions) {
            let shouldTransition = false;
            if (transition[From]) {
                shouldTransition = this.states.getKey(this.nextState ?? this.currentState) === transition[From];
            }
            else if (typeof transition[From] === 'undefined') {
                shouldTransition = true;
            }
            if (!shouldTransition)
                continue;
            if ((typeof transition[Condition] === "function" && transition[Condition]())
                || typeof transition[Condition] === undefined) {
                this.runTransition(transition[From], transition[To]);
                break;
            }
        }
        this.providedUpdate?.(delta, elapsed);
        this.currentState?.[onUpdate]?.(delta, elapsed);
    }
}
