type Component = any;
export declare class Entity {
    get components(): Component[];
    addComponent(component: Component): void;
    removeComponent(component: Component): void;
    hasComponent(component: Component): void;
    getComponent(component: Component): void;
}
export {};
