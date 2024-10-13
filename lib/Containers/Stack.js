/**
 * A stack data structure.
 */
export class Stack {
    /**
     * The number of elements in the stack.
     */
    get size() { return this.#elements.length; }
    /**
     * Pushes elements onto the stack.
     * @param elements The elements to push onto the stack.
     */
    push(...elements) { this.#elements.push(...elements); }
    /**
     * Pops elements off the stack.
     * @returns The element that was popped off the stack.
     */
    pop() { return this.#elements.pop(); }
    /**
     * Peeks at the top element of the stack.
     * @returns The top element of the stack.
     */
    peek() { return this.#elements[this.#elements.length - 1]; }
    /**
     * Checks if the stack is empty.
     * @returns True if the stack is empty, otherwise false.
     */
    isEmpty() { return this.#elements.length === 0; }
    /**
     * Clears the stack.
     */
    clear() { this.#elements.length = 0; }
    /**
     * Iterates over the stack, popping elements off the stack.
     * @returns An iterator over the stack.
     */
    *iterate() { while (this.#elements.length)
        yield this.#elements.pop(); }
    /**
     * Iterates over the stack, not removing elements.
     * @returns An iterator over the stack.
     */
    *peekIterate() { for (const element of this.#elements)
        yield element; }
    #elements = [];
}
