interface State<States extends State[] = [], Context =  Record<PropertyKey, unknown>>
{
	onEnter?(from: States[number], context: Context): void;
	onExit?(to: string, context: Context): void;
	onUpdate?(context: Context): void;
	onDecision?(): void;
}

export class FiniteStateMachine
{
	constructor()
	{

	}
}
