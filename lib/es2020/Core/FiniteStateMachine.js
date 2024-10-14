var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
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
        /** @internal */
        Object.defineProperty(this, _a, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @internal */
        Object.defineProperty(this, _b, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @internal */
        Object.defineProperty(this, _c, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @internal */
        Object.defineProperty(this, _d, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this[onEnter] = args.onEnter;
        this[onExit] = args.onExit;
        this[onUpdate] = args.onUpdate;
        this[Actions] = new Map(Object.entries(args.actions ?? {}));
    }
    addAction(action, callback) { this[Actions].set(action, callback); }
}
_a = Actions, _b = onEnter, _c = onExit, _d = onUpdate;
export class Transition {
    constructor(to, from, condition) {
        /** @internal */
        Object.defineProperty(this, _e, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @internal */
        Object.defineProperty(this, _f, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @internal */
        Object.defineProperty(this, _g, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this[To] = to;
        this[From] = from;
        this[Condition] = condition;
    }
}
_e = To, _f = From, _g = Condition;
export class FiniteStateMachine {
    constructor(args = {}) {
        Object.defineProperty(this, "startingState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nextState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "initialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "transitionPending", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "states", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ReverseMap()
        });
        Object.defineProperty(this, "transitions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "eventTransitions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ReverseMap
        });
        Object.defineProperty(this, "providedUpdate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @internal */
        Object.defineProperty(this, _h, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        /** @internal */
        Object.defineProperty(this, _j, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** @internal */
        Object.defineProperty(this, _k, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
    [(_h = Actions, _j = onEnter, _k = onExit, ExitCurrentState)]() {
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
