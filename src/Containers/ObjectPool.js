export class ObjectPool {
    factory;
    constructor(factory, initialAlloc = 50) {
        this.factory = factory;
        for (let i = 0; i < initialAlloc; i++) {
            this.pool.push(this.factory());
        }
        this.metrics.allocated = initialAlloc;
    }
    alloc() {
        let obj = this.pool.pop();
        if (obj) {
            this.metrics.free--;
            return obj;
        }
        const doubled = this.metrics.allocated * 2;
        for (let i = 0; i < doubled; i++) {
            this.pool.push(this.factory());
            this.metrics.allocated++;
        }
        return this.alloc();
    }
    free(obj) {
        this.pool.push(obj);
        this.metrics.free++;
    }
    metrics = {
        allocated: 0,
        free: 0
    };
    pool = [];
}
