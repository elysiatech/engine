export declare class SinglyLinkedListNode<T> {
    data: T;
    next: SinglyLinkedListNode<T> | null;
    constructor(data: T, next?: SinglyLinkedListNode<T> | null);
}
export declare class SinglyLinkedList<T> {
    #private;
    get length(): number;
    get head(): SinglyLinkedListNode<T> | null;
    get tail(): SinglyLinkedListNode<T> | null;
    /**
     * Add a node to the end of the list
     * @param data - The data to add to the list
     */
    append(data: T): void;
    /**
     * Add a node to the beginning of the list
     * @param data - The data to add to the list
     */
    prepend(data: T): void;
    /**
     * Insert a node at a specific index
     * @param index - The index to insert the node at
     * @param data - The data to insert
     */
    insert(index: number, data: T): void;
    /**
     * Get the node at a specific index
     * @param index - The index to get the node at
     * @returns The node at the index
     */
    getAt(index: number): SinglyLinkedListNode<T> | null;
    /**
     * Remove a node from a specific index
     * @param {number} index - The index to remove the node from
     */
    remove(index: number): void;
    /**
     * Convert the list to an array
     * @returns - The array representation of the list
     */
    toArray(): T[];
    /**
     * Reverse the list
     */
    reverse(): void;
    /**
     * Clear the list
     */
    clear(): void;
    [Symbol.iterator](): Generator<SinglyLinkedListNode<T>, void, unknown>;
}
