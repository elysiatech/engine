var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _SinglyLinkedList_head, _SinglyLinkedList_tail, _SinglyLinkedList_length;
export class SinglyLinkedListNode {
    constructor(data, next = null) {
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: data
        });
        Object.defineProperty(this, "next", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: next
        });
    }
}
export class SinglyLinkedList {
    constructor() {
        _SinglyLinkedList_head.set(this, null);
        _SinglyLinkedList_tail.set(this, null);
        _SinglyLinkedList_length.set(this, 0);
    }
    get length() { return __classPrivateFieldGet(this, _SinglyLinkedList_length, "f"); }
    get head() { return __classPrivateFieldGet(this, _SinglyLinkedList_head, "f"); }
    get tail() { return __classPrivateFieldGet(this, _SinglyLinkedList_tail, "f"); }
    /**
     * Add a node to the end of the list
     * @param data - The data to add to the list
     */
    append(data) {
        var _a;
        const node = new SinglyLinkedListNode(data);
        if (!__classPrivateFieldGet(this, _SinglyLinkedList_head, "f")) {
            __classPrivateFieldSet(this, _SinglyLinkedList_head, node, "f");
            __classPrivateFieldSet(this, _SinglyLinkedList_tail, node, "f");
        }
        else {
            if (__classPrivateFieldGet(this, _SinglyLinkedList_tail, "f")) {
                __classPrivateFieldGet(this, _SinglyLinkedList_tail, "f").next = node;
            }
            __classPrivateFieldSet(this, _SinglyLinkedList_tail, node, "f");
        }
        __classPrivateFieldSet(this, _SinglyLinkedList_length, (_a = __classPrivateFieldGet(this, _SinglyLinkedList_length, "f"), _a++, _a), "f");
    }
    /**
     * Add a node to the beginning of the list
     * @param data - The data to add to the list
     */
    prepend(data) {
        var _a;
        const node = new SinglyLinkedListNode(data);
        if (!__classPrivateFieldGet(this, _SinglyLinkedList_head, "f")) {
            __classPrivateFieldSet(this, _SinglyLinkedList_head, node, "f");
            __classPrivateFieldSet(this, _SinglyLinkedList_tail, node, "f");
        }
        else {
            node.next = __classPrivateFieldGet(this, _SinglyLinkedList_head, "f");
            __classPrivateFieldSet(this, _SinglyLinkedList_head, node, "f");
        }
        __classPrivateFieldSet(this, _SinglyLinkedList_length, (_a = __classPrivateFieldGet(this, _SinglyLinkedList_length, "f"), _a++, _a), "f");
    }
    /**
     * Insert a node at a specific index
     * @param index - The index to insert the node at
     * @param data - The data to insert
     */
    insert(index, data) {
        var _a;
        if (index < 0 || index > __classPrivateFieldGet(this, _SinglyLinkedList_length, "f")) {
            throw new Error('Index out of bounds');
        }
        if (index === 0) {
            this.prepend(data);
            return;
        }
        if (index === __classPrivateFieldGet(this, _SinglyLinkedList_length, "f")) {
            this.append(data);
            return;
        }
        const node = new SinglyLinkedListNode(data);
        let current = __classPrivateFieldGet(this, _SinglyLinkedList_head, "f");
        let previous = null;
        let i = 0;
        while (current && i < index) {
            previous = current;
            current = current.next;
            i++;
        }
        if (previous) {
            previous.next = node;
        }
        if (current) {
            node.next = current;
        }
        __classPrivateFieldSet(this, _SinglyLinkedList_length, (_a = __classPrivateFieldGet(this, _SinglyLinkedList_length, "f"), _a++, _a), "f");
    }
    /**
     * Get the node at a specific index
     * @param index - The index to get the node at
     * @returns The node at the index
     */
    getAt(index) {
        if (index < 0 || index >= __classPrivateFieldGet(this, _SinglyLinkedList_length, "f")) {
            throw new Error('Index out of bounds');
        }
        let current = __classPrivateFieldGet(this, _SinglyLinkedList_head, "f");
        let i = 0;
        while (current && i < index) {
            current = current.next;
            i++;
        }
        return current;
    }
    /**
     * Remove a node from a specific index
     * @param {number} index - The index to remove the node from
     */
    remove(index) {
        var _a;
        if (index < 0 || index >= __classPrivateFieldGet(this, _SinglyLinkedList_length, "f")) {
            throw new Error('Index out of bounds');
        }
        let current = __classPrivateFieldGet(this, _SinglyLinkedList_head, "f");
        let previous = null;
        let i = 0;
        while (current && i < index) {
            previous = current;
            current = current.next;
            i++;
        }
        if (previous) {
            previous.next = current?.next || null;
        }
        else {
            __classPrivateFieldSet(this, _SinglyLinkedList_head, current?.next || null, "f");
        }
        if (current === __classPrivateFieldGet(this, _SinglyLinkedList_tail, "f")) {
            __classPrivateFieldSet(this, _SinglyLinkedList_tail, previous, "f");
        }
        __classPrivateFieldSet(this, _SinglyLinkedList_length, (_a = __classPrivateFieldGet(this, _SinglyLinkedList_length, "f"), _a--, _a), "f");
    }
    /**
     * Convert the list to an array
     * @returns - The array representation of the list
     */
    toArray() {
        const result = [];
        for (const node of this) {
            result.push(node.data);
        }
        return result;
    }
    /**
     * Reverse the list
     */
    reverse() {
        let current = __classPrivateFieldGet(this, _SinglyLinkedList_head, "f");
        let previous = null;
        let next = null;
        while (current) {
            next = current.next;
            current.next = previous;
            previous = current;
            current = next;
        }
        __classPrivateFieldSet(this, _SinglyLinkedList_tail, __classPrivateFieldGet(this, _SinglyLinkedList_head, "f"), "f");
        __classPrivateFieldSet(this, _SinglyLinkedList_head, previous, "f");
    }
    /**
     * Clear the list
     */
    clear() {
        __classPrivateFieldSet(this, _SinglyLinkedList_head, null, "f");
        __classPrivateFieldSet(this, _SinglyLinkedList_tail, null, "f");
        __classPrivateFieldSet(this, _SinglyLinkedList_length, 0, "f");
    }
    *[(_SinglyLinkedList_head = new WeakMap(), _SinglyLinkedList_tail = new WeakMap(), _SinglyLinkedList_length = new WeakMap(), Symbol.iterator)]() {
        let current = __classPrivateFieldGet(this, _SinglyLinkedList_head, "f");
        while (current) {
            yield current;
            current = current.next;
        }
    }
}
