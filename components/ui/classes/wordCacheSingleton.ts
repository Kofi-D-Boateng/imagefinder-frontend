type CharacterCache = {
  [key: string]: TrieNode;
};

/**
 * @author Kofi Boateng
 * @class TrieNode
 * @description A Node that represents a mapping of character to adjacent
 *              Nodes
 */
class TrieNode {
  children: CharacterCache;
  endOfWord: boolean;
  constructor() {
    this.children = {};
    this.endOfWord = false;
  }
}

/**
 * @author Kofi Boateng
 * @class TrieTree
 * @description A Trie Tree cache that will help with word search and insertion.
 *
 */
class TrieTree {
  _root: TrieNode;
  _size: number;
  constructor() {
    this._root = new TrieNode();
    this._size = 0;
  }
  /**
   *
   * @param str a string or character to insert into the tree
   * @returns void
   */
  insert(str: string): void {
    if (!str || str.trim().length <= 0) return;
    let currNode = this._root;
    for (const char of str) {
      if (!currNode.children[char]) {
        const newNode = new TrieNode();
        currNode.children[char] = newNode;
      }
      currNode = currNode.children[char];
    }
    currNode.endOfWord = true;
    this._size++;
  }
  /**
   *
   * @param str a prefix or string
   * @returns a boolean of where the string is currently in the tree.
   */
  search(str: string): boolean {
    if (!str || str.trim().length <= 0) return false;
    let currNode = this._root;
    for (const char of str) {
      if (!currNode.children[char]) {
        return false;
      }
      currNode = currNode.children[char];
    }
    return currNode.endOfWord;
  }
  size(): number {
    return this._size;
  }
}

/**
 * @author Kofi Boateng
 * @file wordCacheSingleton.ts
 *
 * @description This is singleton class backed by a Trie Tree that will
 *              cache urls or strings and help with error checking in
 *              the search bar.
 *
 */
class WordCacheSingleton {
  static instance: WordCacheSingleton;
  static cache: TrieTree;

  constructor() {
    if (!WordCacheSingleton.instance) {
      WordCacheSingleton.instance = this;
      return this;
    }
    return WordCacheSingleton.instance;
  }

  getCache(): TrieTree {
    if (!WordCacheSingleton.cache) {
      const newCache: TrieTree = new TrieTree();
      return newCache;
    }
    return WordCacheSingleton.cache;
  }
}

const wordCache = new WordCacheSingleton();
Object.freeze(wordCache);
export { wordCache, TrieTree };
