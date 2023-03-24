import { WordCacheSingleton } from "classes/wordCacheSingleton";

describe("WordCacheSingleton Test Suite", () => {
  test("Singleton Creation", () => {
    const cache = WordCacheSingleton.getInstance();
    expect(cache).not.toEqual(null || undefined);
  });

  test("Singleton Immutability", () => {
    const cache1 = WordCacheSingleton.getCache();
    const cache2 = WordCacheSingleton.getCache();
    expect(cache1).toEqual(cache2);
    cache1.insert("test_string");
    cache2.insert("another_test_string");
    expect(cache1.size()).toEqual(cache2.size());
  });
});
