export type ImageMap<K extends string | number | symbol, V> = {
  [key in K]?: V[];
};

export type UrlImageMap<K extends string | number | symbol, V> = {
  [key in K]?: ImageMap<K, V>;
};
