export interface List<T> {
  get(Index: number): T | null;
  add(Object: T): void;
  remove(Object: T): void;
  remove(index: number): void;
  removeAll(): void;
  contains(Object: T): boolean;
  toArray(): Array<T>;
  size(): number;
  isEmpty(): boolean;
  [Symbol.iterator](): Iterator<T>;
}
