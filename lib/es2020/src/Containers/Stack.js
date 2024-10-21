var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Stack_elements;
/**
 * A stack data structure.
 */
export class Stack {
    constructor() {
        _Stack_elements.set(this, []);
    }
    /**
     * The number of elements in the stack.
     */
    get size() { return __classPrivateFieldGet(this, _Stack_elements, "f").length; }
    /**
     * Pushes elements onto the stack.
     * @param elements The elements to push onto the stack.
     */
    push(...elements) { __classPrivateFieldGet(this, _Stack_elements, "f").push(...elements); }
    /**
     * Pops elements off the stack.
     * @returns The element that was popped off the stack.
     */
    pop() { return __classPrivateFieldGet(this, _Stack_elements, "f").pop(); }
    /**
     * Peeks at the top element of the stack.
     * @returns The top element of the stack.
     */
    peek() { return __classPrivateFieldGet(this, _Stack_elements, "f")[__classPrivateFieldGet(this, _Stack_elements, "f").length - 1]; }
    /**
     * Checks if the stack is empty.
     * @returns True if the stack is empty, otherwise false.
     */
    isEmpty() { return __classPrivateFieldGet(this, _Stack_elements, "f").length === 0; }
    /**
     * Clears the stack.
     */
    clear() { __classPrivateFieldGet(this, _Stack_elements, "f").length = 0; }
    /**
     * Iterates over the stack, popping elements off the stack.
     * @returns An iterator over the stack.
     */
    *iterate() { while (__classPrivateFieldGet(this, _Stack_elements, "f").length)
        yield __classPrivateFieldGet(this, _Stack_elements, "f").pop(); }
    /**
     * Iterates over the stack, not removing elements.
     * @returns An iterator over the stack.
     */
    *peekIterate() { for (const element of __classPrivateFieldGet(this, _Stack_elements, "f"))
        yield element; }
}
_Stack_elements = new WeakMap();
