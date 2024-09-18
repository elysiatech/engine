export class DoublyLinkedListNode<T> {
	constructor(public data: T, public next: DoublyLinkedListNode<T> | null = null, public prev: DoublyLinkedListNode<T> | null = null) {}
}

export class DoublyLinkedList<T> {

	get length() { return this.#length; }
	get head() { return this.#head; }
	get tail() { return this.#tail; }

	append(data: T) {

	}

	#head: DoublyLinkedListNode<T> | null = null;

	#tail: DoublyLinkedListNode<T> | null = null;

	#length = 0;
}