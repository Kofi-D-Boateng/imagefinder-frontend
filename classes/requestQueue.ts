import { List } from "interfaces/List";
import { Queue } from "interfaces/Queue";

/**
 *
 * @author Kofi Boateng
 *
 * This class is purposed with creating new nodes for List data structures
 *
 */
export class Node<T> {
  next: Node<T> | null;
  prev: Node<T> | null;
  data: T;
  constructor(newData: T) {
    this.next = null;
    this.prev = null;
    this.data = newData;
  }
}

/**
 * Doubly Linked List
 * @author Kofi Boateng
 *
 * This class is tasked with implementing a doubly linked list to keep
 * track of members to a room
 *
 *
 */
class LinkedList<T> implements List<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private length: number;
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  getHead(): Node<T> | null {
    return this.head;
  }
  getTail(): Node<T> | null {
    return this.tail;
  }
  add(member: T): void {
    const N: Node<T> = new Node(member);
    if (this.length == 0) {
      this.pushFront(N);
      return;
    }
    this.pushBack(N);
  }
  copy(Queue: LinkedList<T>): void {
    this.head = Queue.head;
    this.tail = Queue.tail;
    this.length = Queue.length;
  }
  contains(Object: T): boolean {
    if (!this.head && !this.tail) return false;
    else if (this.head?.data == Object) return true;
    else if (this.tail?.data == Object) return true;
    else {
      const foundNode = this.findNodeByObject(Object);
      return foundNode != null;
    }
  }
  get(Index: number): T | null {
    if (this.length <= 0) return null;
    if (Index == this.length - 1) return this.tail.data;
    if (Index == 0) return this.head.data;
    const foundNode = this.findNodeByIndex(Index);
    if (!foundNode) return null;
    return foundNode.data;
  }
  isEmpty(): boolean {
    return this.length <= 0;
  }
  removeAll(): void {}
  remove(Object: number | T): void {
    if (this.length == 1) {
      this.head = null;
      this.tail = null;
      this.length = 0;
      return;
    }
    let foundNode: Node<T> | null = null;
    if (typeof Object === "number") {
      foundNode = this.findNodeByIndex(Object);
    } else {
      foundNode = this.findNodeByObject(Object);
    }
    if (foundNode) {
      if (!foundNode.prev && foundNode.next) {
        // Reposition head node
        let prevHeadNext = foundNode.next;
        prevHeadNext.prev = null;
        this.head = prevHeadNext;
      } else if (!foundNode.next && foundNode.prev) {
        // Update tail;
        let TailPrev = foundNode.prev;
        TailPrev.next = null;
        this.tail = TailPrev;
      } else {
        let foundNodePrev = foundNode.prev;
        let foundNodeNext = foundNode.next;
        foundNodePrev!.next = foundNodeNext;
        foundNodeNext!.prev = foundNodePrev;
      }
      this.length--;
    }
  }
  size(): number {
    return this.length;
  }
  toArray(): Array<T> {
    let arr: Array<T> = [],
      i = 0,
      currNode = this.head;
    while (i < this.length) {
      if (currNode?.data != null) {
        arr.push(currNode.data);
        currNode = currNode.next;
      }
      i++;
    }
    return arr;
  }
  private findNodeByIndex(index: number): Node<T> | null {
    let currNode = this.head;
    let count = 0;
    while (currNode && count != index) {
      currNode = currNode.next;
    }
    return currNode;
  }
  private findNodeByObject(obj: T): Node<T> | null {
    let curr = this.head;
    while (curr) {
      if (curr === obj) return curr;
      else curr = curr.next;
    }
    null;
  }
  private pushFront(Node: Node<T>): void {
    if (!this.head) {
      this.head = Node;
      this.tail = Node;
    } else {
      let oldHead = this.head;
      oldHead!.prev = Node;
      Node.next = oldHead;
      oldHead = Node;
    }
    this.length++;
  }
  private pushBack(Node: Node<T>): void {
    if (!this.head) {
      this.head = Node;
      this.tail = Node;
    } else {
      this.tail!.next = Node;
      Node.prev = this.tail;
      this.tail = Node;
    }
    this.length++;
  }
  *[Symbol.iterator]() {
    let curr = this.head;
    while (curr) {
      yield curr.data;
      curr = curr.next;
    }
  }
}

/**
 * @author Kofi Boateng
 * @class Request Queue
 * @description A queue that is backed by a doubly linked and a binary semaphore that can be used to process events that need to be waited until completion
 */
export class RequestQueue<T> implements Queue<T> {
  private _semaphore: number;
  private _size: number;
  private _queue: LinkedList<T>;
  constructor() {
    this._queue = new LinkedList();
    this._size = this._queue.size();
    this._semaphore = 0;
  }
  poll(): T {
    const elem = this._queue.get(0);
    this._queue.remove(0);
    return elem;
  }
  get(): T {
    const elem = this._queue.get(0);
    this._queue.remove(0);
    return elem;
  }
  offer(Object: T): void {
    this._queue.add(Object);
  }
  add(Object: T): void {
    return this._queue.add(Object);
  }
  size(): number {
    return this._size;
  }
  isEmpty(): boolean {
    return this._queue.isEmpty();
  }

  increment(): void {
    console.log("[STATUS]: Increment has been called.");
    if (this.isWaiting()) return;
    this._semaphore++;
  }
  decrement(): void {
    console.log("[STATUS]: Decrement has been called.");
    if (!this.isWaiting()) return;
    this._semaphore - 1;
  }
  isWaiting(): boolean {
    return this._semaphore > 0;
  }
  sempahoreCount(): number {
    return this._semaphore;
  }
}
