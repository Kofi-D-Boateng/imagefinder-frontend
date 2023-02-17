import { TrieTree } from "@/components/ui/classes/wordCacheSingleton";

describe("TrieTree Test Suite", () => {
  test("Trie Creation", () => {
    const trie = new TrieTree();
    expect(trie).toBeInstanceOf(TrieTree);
  });

  test("Trie Insertion", () => {
    const trie = new TrieTree();
    const string = "test_string";
    trie.insert(string);
    expect(trie.size()).toBe(1);
  });

  test("Trie Search", () => {
    const trie = new TrieTree();
    const string1 = "test_string";
    const string2 = "test string";
    trie.insert(string1);
    expect(trie.search(string2)).toBe(false);
    expect(trie.search(string1)).toBe(true);
  });

  test("Trie Size", () => {
    const trie = new TrieTree();
    const string1 = "test_string";
    const string2 = "test string";
    trie.insert(string1);
    trie.insert(string2);
    expect(trie.size()).toBe(2);
  });

  // test("Trie Print", () => {
  //   const trie = new TrieTree();
  //   const string1 = "test_string";
  //   const string2 = "test string";
  //   trie.insert(string1);
  //   trie.insert(string2);
  //   trie.printAll();
  // });
});
