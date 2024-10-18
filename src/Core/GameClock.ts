export class GameClock
{
	public get elapsed() { return this.#elapsed; }

	public get delta() { return this.#delta; }

	public capture()
	{
		if(!this.#started)
		{
			this.#started = true;
			this.#now = performance.now();
			this.#last = this.#now;
			return;
		}
		this.#now = performance.now();
		this.#delta = (this.#now - this.#last) / 1000;
		this.#elapsed += this.#delta;
		this.#last = this.#now;
	}

	#started = false;
	#now = 0;
	#last = 0;
	#elapsed = 0;
	#delta = 0.016;
}