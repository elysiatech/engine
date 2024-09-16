export class ElysiaEvent<T extends unknown> {
	public timestamp = performance.now();
	constructor(public readonly value: T) {}
}