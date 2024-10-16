import { CatchAndReport } from "./ErrorHandler.js";
import * as Internal from "./Internal.js";
export class System {
    world;
    constructor(world) {
        this.world = world;
    }
    get active() { return this[Internal.isActive] && !this[Internal.isDestroyed]; }
    get destroyed() { return this[Internal.isDestroyed]; }
    @CatchAndReport
    destructor() {
        this[Internal.isDestroyed] = true;
        this[Internal.isActive] = false;
        this.world.removeSystem(this);
    }
    [Internal.isDestroyed] = false;
    [Internal.isActive] = false;
    @CatchAndReport
    [Internal.onStart]() { this.onStart?.(); }
    @CatchAndReport
    [Internal.onUpdate](delta, elapsed) { this.onUpdate?.(delta, elapsed); }
    @CatchAndReport
    [Internal.onStop]() { this.onStop?.(); }
    @CatchAndReport
    [Internal.onEntityAdded](entity) { this.onEntityAdded?.(entity); }
    @CatchAndReport
    [Internal.onEntityRemoved](entity) { this.onEntityRemoved?.(entity); }
    @CatchAndReport
    [Internal.onComponentAdded](entity, component) { this.onComponentAdded?.(entity, component); }
    @CatchAndReport
    [Internal.onComponentRemoved](entity, component) { this.onComponentRemoved?.(entity, component); }
}
