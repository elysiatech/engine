export function toBoolean(val: any) { return val ? val !== "false" : false; }

export function clamp(val: number, min: number, max: number) {
	try
	{
		return Math.min(Math.max(Number(val), Number(min)), Number(max));
	}
	catch
	{
		return min;
	}
}

export function toError(err: unknown)
{
	if (err instanceof Error) { return err }
	if(typeof err === 'string') { return new Error(err) }
	return new Error(String(err))
}

export function noop() {}

export type Constructor<T> = new (...args: any[]) => T

export type Maybe<T> = T | null | undefined;

export type MaybePromise<T> = T | Promise<T>;

export type Serializable = string | number | boolean | null | undefined | Serializable[] | { [key: string]: Serializable };

