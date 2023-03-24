export interface Queue<T> {
  offer(elem: T): void;
  add(elem: T): void;
  poll(): T;
  get(): T;
  size(): number;
  isEmpty(): boolean;
}
