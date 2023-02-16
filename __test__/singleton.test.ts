import { wordCache } from "@/components/ui/classes/wordCacheSingleton";

describe("WordCacheSingleton Test Suite", () => {
  test("Singleton Creation", () => {
    const cache = wordCache.getCache();
    expect(cache).not.toEqual(null || undefined);
  });

  test("Singleton Immutability", () => {
    const cache1 = wordCache.getCache();
    const cache2 = wordCache.getCache();
    expect(cache1).toEqual(cache2);
  });
});
