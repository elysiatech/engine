/**
 * SparseSet is a data structure that is used to store a set of unique values.
 * It is similar to a Set, but it is optimized for memory usage.
 * It is implemented as a sparse array, where each index is a value in the set,
 * and the value at that index is the index of the next value in the set.
 * This allows for fast iteration over the set, as well as fast insertion and deletion of values.
 */
export class SparseSet<T>
{
	/**
	 * Adds a value to the set.
	 * @param value The value to add.
	 */
	public add(value: T): void
	{
		if (!this.sparse.has(value))
		{
			const index = this.dense.length;
			this.sparse.set(value, index);
			this.dense.push(value);
		}
	}

	/**
	 * Removes a value from the set.
	 * @param value The value to remove.
	 */
	public delete(value: T): void
	{
		const index = this.sparse.get(value);
		if (index !== undefined)
		{
			const last = this.dense.pop();
			if (last !== value)
			{
				this.dense[index] = last!;
				this.sparse.set(last!, index);
			}
			this.sparse.delete(value);
		}
	}

	/**
	 * Checks if a value is in the set.
	 * @param value The value to check.
	 * @returns True if the value is in the set, false otherwise.
	 */
	public has(value: T): boolean
	{
		return this.sparse.has(value);
	}

	/**
	 * Returns an iterator over the values in the set.
	 * @returns An iterator over the values in the set.
	 */
	public values(): IterableIterator<T>
	{
		return this.dense.values();
	}

	/**
	 * Map the values of the set to a new array.
	 * @param callback
	 */
	public map<U>(callback: (value: T) => U): U[]
	{
		return this.dense.map(callback);
	}

	/**
	 * Iterate over the values of the set.
	 * @param callback
	 */
	public forEach(callback: (value: T) => void): void
	{
		this.dense.forEach(callback);
	}

	private dense: T[] = [];
	private sparse = new Map<T, number>();
}