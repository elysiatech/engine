export class WorkerThread
{
	constructor(private worker?: Worker)
	{
		this.onMessage = this.onMessage.bind(this);
		if(worker)
		{
			worker.addEventListener("message", this.onMessage);
		}
		else
		{
			addEventListener("message", this.onMessage);
		}
	}

	listen()
	{
		for(const [key, value] of Object.entries(this))
		{
			if(key.startsWith("#")) continue;

			if(key.startsWith("on") && typeof value === "function")
			{
				this[key as keyof this] = value.bind(this);
			}
		}
		return this;
	}

	send(key: string, payload: any)
	{
		if(this.worker) this.worker.postMessage({ $key: key, payload });
		else postMessage({ $key: key, payload });
	}

	private onMessage(event: MessageEvent)
	{
		if(typeof this[event.data?.$key as keyof this] === "function")
		{
			// @ts-ignore
			this[event.data.$key as keyof this](event.data.payload);
		}
	}
}