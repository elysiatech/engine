export class BasicConsoleWriter {
    name;
    constructor(name) {
        this.name = name;
    }
    debug(message) {
        console.debug(`${performance.now()} [${this.name}] DEBUG`, ...message);
    }
    info(message) {
        console.info(`${performance.now()} [${this.name}] INFO`, ...message);
    }
    success(message) {
        console.log(`${performance.now()} [${this.name}] SUCCESS`, ...message);
    }
    warn(message) {
        console.warn(`${performance.now()} [${this.name}] WARN`, ...message);
    }
    error(message) {
        console.error(`${performance.now()} [${this.name}] ERROR`, ...message);
    }
    critical(message) {
        console.error(`${performance.now()} [${this.name}] CRITICAL`, ...message);
    }
}
