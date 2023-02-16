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
export class TrieTree {
  private _root: TrieNode;
  private _size: number;
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
  // printAll(): void {
  //   const wordArr = new Array(this._size);
  //   const arr = this.dfs(this._root);
  //   wordArr.push(arr);
  //   for (const str of wordArr) console.log(str);
  // }

  // private dfs(node: TrieNode): Array<string> {
  //   const arr: Array<string> = Array();
  //   for (const key in node.children) {
  //     const string = key;
  //     string.concat(this.stringBuilder(node.children[key]).join());
  //     arr.push(string);
  //   }
  //   return arr;
  // }

  // private stringBuilder(node: TrieNode): Array<string> {
  //   if (node.endOfWord) return [];
  //   const returnStringArr = [];
  //   for (const k in node.children) {
  //     returnStringArr.push(k);
  //     const val = this.stringBuilder(node.children[k]);
  //     if (val.length > 0) {
  //       returnStringArr.concat(val);
  //     }
  //   }
  //   return returnStringArr;
  // }
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
export class WordCacheSingleton {
  private static instance: WordCacheSingleton;
  private static readonly cache: TrieTree = new TrieTree();

  constructor() {
    if (!WordCacheSingleton.instance) {
      WordCacheSingleton.instance = this;
      return this;
    }
    return WordCacheSingleton.instance;
  }

  public static getInstance(): WordCacheSingleton {
    if (!WordCacheSingleton.instance) {
      WordCacheSingleton.instance = new WordCacheSingleton();
    }
    return WordCacheSingleton.instance;
  }

  public static getCache(): TrieTree {
    return WordCacheSingleton.cache;
  }
}
