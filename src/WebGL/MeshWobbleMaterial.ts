import * as Three from "three";

export interface MeshWobbleMaterialConstructorArguments
{
	time?: number
	factor?: number
}

export class MeshWobbleMaterial extends Three.MeshStandardMaterial
{
	get time() { return this.#time.value }
	set time(v) { this.#time.value = v }

	get factor() { return this.#factor.value }
	set factor(v) { this.#factor.value = v }

	constructor({ time = 0, factor = 1, ...parameters }: Three.MeshStandardMaterialParameters & MeshWobbleMaterialConstructorArguments = {}) {
		super(parameters)
		this.setValues(parameters)
		this.#time = { value: time }
		this.#factor = { value: factor }
	}

	override onBeforeCompile(shader: { vertexShader: string; uniforms: { [uniform: string]: Three.IUniform } }) {
		shader.uniforms['time'] = this.#time
		shader.uniforms['factor'] = this.#factor

		shader.vertexShader = `
      		uniform float time;
      		uniform float factor;
      		${shader.vertexShader}
    	`
		shader.vertexShader = shader.vertexShader.replace(
			'#include <begin_vertex>',
			`float theta = sin( time + position.y ) / 2.0 * factor;
        	float c = cos( theta );
        	float s = sin( theta );
        	mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );
        	vec3 transformed = vec3( position ) * m;
        	vNormal = vNormal * m;`
		)
	}

	#time: Three.IUniform<number>
	#factor: Three.IUniform<number>
}