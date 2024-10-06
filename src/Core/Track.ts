import * as Three from 'three'

const internal = Symbol('internal')

export function track(
	object: Record<any, any>, keys: string[],
	callback: (key: string, value: any, object: Record<string, any>) => void
)
{
	for(const key of keys)
	{
		object[internal as keyof object] = object[internal as keyof object] ?? {}
		object[internal as keyof object][key] = object[key]
		Object.defineProperty(object, key, {
			get()
			{
				return object[internal as keyof object][key]
			},
			set(value)
			{
				object[internal as keyof object][key] = value
				callback(key, value, object)
			},
			configurable: true,
			enumerable: true,
		})
	}
}