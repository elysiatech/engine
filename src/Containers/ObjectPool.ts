
export class ObjectPool<T> {

	constructor(private factory: () => T, initialAlloc = 50) {
		for (let i = 0; i < initialAlloc; i++) {
			this.pool.push(this.factory());
		}
		this.metrics.allocated = initialAlloc;
	}

	public alloc(): T {
		let obj = this.pool.pop();

		if (obj) {
			this.metrics.free--;
			return obj;
		}

		const doubled = this.metrics.allocated * 2;

		for (let i = 0; i < doubled; i++) {
			this.pool.push(this.factory());
			this.metrics.allocated++
		}

		return this.alloc();
	}

	public free(obj: T) {
		this.pool.push(obj);
		this.metrics.free++;
	}

	private metrics = {
		allocated: 0,
		free: 0
	};

	private pool: T[] = [];
}