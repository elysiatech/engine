export class Behavior {
    get isBehavior() {
        return true;
    }
    id;
    tags = new Set();
    parent = null;
    scene = null;
    app = null;
    initialized = false;
    spawned = false;
    destroyed = false;
    create() {
        if (this.initialized || this.destroyed || !this.scene || !this.scene.app)
            return;
        this.onCreate();
        this.initialized = true;
    }
    spawn() {
        if (!this.initialized || this.spawned || this.destroyed)
            return;
        this.onSpawn();
        this.spawned = true;
    }
    update(frametime, elapsed) {
        if (!this.initialized || !this.spawned || this.destroyed)
            return;
        this.onUpdate(frametime, elapsed);
    }
    despawn() {
        if (!this.spawned || this.destroyed)
            return;
        this.onDespawn();
    }
    destroy() {
        if (this.destroyed)
            return;
        this.destructor();
    }
    resize(bounds) {
        if (!this.initialized || this.destroyed)
            return;
        this.onResize(bounds);
    }
    dispose(...callbacks) {
        this.disposables.push(...callbacks);
    }
    onCreate() { }
    onSpawn() { }
    onUpdate(frametime, elapsedtime) { }
    onDespawn() { }
    onResize(bounds) { }
    destructor() {
        this.disposables.forEach((fn) => fn());
        this.disposables = [];
        this.destroyed = true;
    }
    disposables = [];
}
