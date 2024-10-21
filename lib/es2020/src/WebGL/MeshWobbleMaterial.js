var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _MeshWobbleMaterial_time, _MeshWobbleMaterial_factor;
import * as Three from "three";
export class MeshWobbleMaterial extends Three.MeshStandardMaterial {
    get time() { return __classPrivateFieldGet(this, _MeshWobbleMaterial_time, "f").value; }
    set time(v) { __classPrivateFieldGet(this, _MeshWobbleMaterial_time, "f").value = v; }
    get factor() { return __classPrivateFieldGet(this, _MeshWobbleMaterial_factor, "f").value; }
    set factor(v) { __classPrivateFieldGet(this, _MeshWobbleMaterial_factor, "f").value = v; }
    constructor({ time = 0, factor = 1, ...parameters } = {}) {
        super(parameters);
        _MeshWobbleMaterial_time.set(this, void 0);
        _MeshWobbleMaterial_factor.set(this, void 0);
        this.setValues(parameters);
        __classPrivateFieldSet(this, _MeshWobbleMaterial_time, { value: time }, "f");
        __classPrivateFieldSet(this, _MeshWobbleMaterial_factor, { value: factor }, "f");
    }
    onBeforeCompile(shader) {
        shader.uniforms['time'] = __classPrivateFieldGet(this, _MeshWobbleMaterial_time, "f");
        shader.uniforms['factor'] = __classPrivateFieldGet(this, _MeshWobbleMaterial_factor, "f");
        shader.vertexShader = `
      		uniform float time;
      		uniform float factor;
      		${shader.vertexShader}
    	`;
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `float theta = sin( time + position.y ) / 2.0 * factor;
        	float c = cos( theta );
        	float s = sin( theta );
        	mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );
        	vec3 transformed = vec3( position ) * m;
        	vNormal = vNormal * m;`);
    }
}
_MeshWobbleMaterial_time = new WeakMap(), _MeshWobbleMaterial_factor = new WeakMap();
