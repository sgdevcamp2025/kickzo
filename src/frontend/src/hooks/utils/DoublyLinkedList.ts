export interface DoublyLinkedListNode<T> {
  value: T;
  next: DoublyLinkedListNode<T> | null;
  prev: DoublyLinkedListNode<T> | null;
}

export class DoublyLinkedList<T> {
  public head: DoublyLinkedListNode<T> | null = null;
  public tail: DoublyLinkedListNode<T> | null = null;
  public length: number = 0;

  constructor(initialElements?: T[]) {
    if (initialElements && initialElements.length > 0) {
      initialElements.forEach(el => this.push(el));
    }
  }

  push(value: T): void {
    const newNode: DoublyLinkedListNode<T> = {
      value,
      next: null,
      prev: this.tail,
    };

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
      }
      this.tail = newNode;
    }
    this.length++;
  }

  unshift(value: T): void {
    const newNode: DoublyLinkedListNode<T> = {
      value,
      next: this.head,
      prev: null,
    };

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.length++;
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.length) return undefined;
    let current: DoublyLinkedListNode<T> | null;
    if (index < this.length / 2) {
      current = this.head;
      for (let i = 0; i < index; i++) {
        if (current) current = current.next;
      }
    } else {
      current = this.tail;
      for (let i = this.length - 1; i > index; i--) {
        if (current) current = current.prev;
      }
    }
    return current?.value;
  }

  slice(start: number, end: number): T[] {
    const result: T[] = [];
    if (start < 0) start = 0;
    if (end > this.length) end = this.length;
    let current = this.head;
    let index = 0;
    while (current && index < end) {
      if (index >= start) {
        result.push(current.value);
      }
      current = current.next;
      index++;
    }
    return result;
  }

  toArray(): T[] {
    return this.slice(0, this.length);
  }
}
