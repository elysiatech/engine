type Component = any;

export class Entity {
	get components(): Component[] { return [] }
	addComponent(component: Component) {}
	removeComponent(component: Component) {}
	hasComponent(component: Component) {}
	getComponent(component: Component) {}
}
