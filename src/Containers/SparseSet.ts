/**
 * SparseSet is a data structure that is used to store a set of unique values.
 * It is backed by a dense array and a sparse map.
 * The dense array stores the values in contiguous memory, while the sparse map
 * stores the index of each value in the dense array.
 * This means it is possible to look up the index of a value in constant time.
 * However, the set does not guarantee the order of the values.
 */
export class SparseSet<T>
{

	/**
	 * Returns the first element in the set or undefined if the set is empty.
	 */
	get first(): T | undefined
	{
		return this.dense[0];
	}

	/**
	 * Returns the last element in the set or undefined if the set is empty.
	 */
	get last(): T | undefined
	{
		return this.dense[this.dense.length - 1];
	}

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

	/**
	 * Filter the values of the set.
	 * @param callback
	 */
	public filter(callback: (value: T) => boolean): T[]
	{
		return this.dense.filter(callback);
	}

	/**
	 * Returns the value at the given index in the set.
	 * @param index The index of the value to return.
	 * @returns The value at the given index, or undefined if the index is out of bounds.
	 */
	at(index: number): T | undefined
	{
		return this.dense[index];
	}

	public *[Symbol.iterator]()
	{
		for (let value of this.dense)
		{
			yield value;
		}
	}

	private dense: T[] = [];
	private sparse = new Map<T, number>();
}