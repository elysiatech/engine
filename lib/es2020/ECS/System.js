var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __propKey = (this && this.__propKey) || function (x) {
    return typeof x === "symbol" ? x : "".concat(x);
};
import { CatchAndReport } from "./ErrorHandler.js";
import * as Internal from "./Internal.js";
let System = (() => {
    var _a, _b, _c;
    var _d, _e, _f, _g, _h, _j, _k;
    let _instanceExtraInitializers = [];
    let _destructor_decorators;
    let _member_decorators;
    let _member_decorators_1;
    let _member_decorators_2;
    let _member_decorators_3;
    let _member_decorators_4;
    let _member_decorators_5;
    let _member_decorators_6;
    return _a = class System {
            constructor(world) {
                Object.defineProperty(this, "world", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: (__runInitializers(this, _instanceExtraInitializers), world)
                });
                Object.defineProperty(this, _b, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: false
                });
                Object.defineProperty(this, _c, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: false
                });
            }
            get active() { return this[Internal.isActive] && !this[Internal.isDestroyed]; }
            get destroyed() { return this[Internal.isDestroyed]; }
            destructor() {
                this[Internal.isDestroyed] = true;
                this[Internal.isActive] = false;
                this.world.removeSystem(this);
            }
            [(_b = (_destructor_decorators = [CatchAndReport], Internal.isDestroyed), _c = Internal.isActive, _member_decorators = [CatchAndReport], _d = __propKey(Internal.onStart))]() { this.onStart?.(); }
            [(_member_decorators_1 = [CatchAndReport], _e = __propKey(Internal.onUpdate))](delta, elapsed) { this.onUpdate?.(delta, elapsed); }
            [(_member_decorators_2 = [CatchAndReport], _f = __propKey(Internal.onStop))]() { this.onStop?.(); }
            [(_member_decorators_3 = [CatchAndReport], _g = __propKey(Internal.onEntityAdded))](entity) { this.onEntityAdded?.(entity); }
            [(_member_decorators_4 = [CatchAndReport], _h = __propKey(Internal.onEntityRemoved))](entity) { this.onEntityRemoved?.(entity); }
            [(_member_decorators_5 = [CatchAndReport], _j = __propKey(Internal.onComponentAdded))](entity, component) { this.onComponentAdded?.(entity, component); }
            [(_member_decorators_6 = [CatchAndReport], _k = __propKey(Internal.onComponentRemoved))](entity, component) { this.onComponentRemoved?.(entity, component); }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(_a, null, _destructor_decorators, { kind: "method", name: "destructor", static: false, private: false, access: { has: obj => "destructor" in obj, get: obj => obj.destructor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators, { kind: "method", name: _d, static: false, private: false, access: { has: obj => _d in obj, get: obj => obj[_d] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_1, { kind: "method", name: _e, static: false, private: false, access: { has: obj => _e in obj, get: obj => obj[_e] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_2, { kind: "method", name: _f, static: false, private: false, access: { has: obj => _f in obj, get: obj => obj[_f] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_3, { kind: "method", name: _g, static: false, private: false, access: { has: obj => _g in obj, get: obj => obj[_g] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_4, { kind: "method", name: _h, static: false, private: false, access: { has: obj => _h in obj, get: obj => obj[_h] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_5, { kind: "method", name: _j, static: false, private: false, access: { has: obj => _j in obj, get: obj => obj[_j] }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _member_decorators_6, { kind: "method", name: _k, static: false, private: false, access: { has: obj => _k in obj, get: obj => obj[_k] }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { System };
