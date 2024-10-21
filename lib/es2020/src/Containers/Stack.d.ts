/**
 * A stack data structure.
 */
export declare class Stack<T> {
    #private;
    /**
     * The number of elements in the stack.
     */
    get size(): number;
    /**
     * Pushes elements onto the stack.
     * @param elements The elements to push onto the stack.
     */
    push(...elements: T[]): void;
    /**
     * Pops elements off the stack.
     * @returns The element that was popped off the stack.
     */
    pop(): T | undefined;
    /**
     * Peeks at the top element of the stack.
     * @returns The top element of the stack.
     */
    peek(): T;
    /**
     * Checks if the stack is empty.
     * @returns True if the stack is empty, otherwise false.
     */
    isEmpty(): boolean;
    /**
     * Clears the stack.
     */
    clear(): void;
    /**
     * Iterates over the stack, popping elements off the stack.
     * @returns An iterator over the stack.
     */
    iterate(): Generator<T | undefined, void, unknown>;
    /**
     * Iterates over the stack, not removing elements.
     * @returns An iterator over the stack.
     */
    peekIterate(): Generator<T, void, unknown>;
}
