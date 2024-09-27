import { toError } from "./Utilities";

/**
 * Immediately runs the provided function, catching and returning all uncaught exceptions.
 */
export default function run<T>(
	fn: () => T
): T extends Promise<any> ? (Promise<Error | Awaited<T>>) : (Error | T)
{
	try
	{
		const value = fn()
		if(value instanceof Promise)
		{
			// @ts-ignore
			return new Promise<Error | Awaited<T>>(
				(res) =>
				{
					value.then(val => res(val)).catch(err => res(toError(err)))
				}
			);
		}
		else
		{
			// @ts-ignore
			return value;
		}
	}
	catch(e)
	{
		// @ts-ignore
		return toError(e);
	}
}