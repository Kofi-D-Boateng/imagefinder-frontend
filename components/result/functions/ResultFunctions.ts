import { DownloadType } from "enums/Download";
import { UrlImageMap } from "interfaces/ImageMap";
import JSZip from "jszip";
import { Dispatch, MouseEvent, SetStateAction } from "react";

export const addRemoveHandler: (
  key: string,
  src: string,
  map: Map<string, Set<string>>,
  setAmount: Dispatch<
    SetStateAction<{
      [key: string]: number;
    }>
  >
) => void = (key, src, map, setAmount) => {
  if (!map.has(key)) {
    map.get(key).add(src);
    setAmount((prev) => {
      prev[key]++;
      return { ...prev };
    });
  } else {
    map.get(key).delete(src);
    setAmount((prev) => {
      if (prev[key] > 0) {
        prev[key]--;
      }
      return { ...prev };
    });
  }
};

export const downloadHandler: (
  type: DownloadType,
  imageMap?: UrlImageMap<string, string> | Map<string, Set<string>>,
  src?: string
) => void = (type, map, src) => {
  if (type === DownloadType.BULK) {
    const m: UrlImageMap<string, string> = map as UrlImageMap<string, string>;
    Object.keys(m).forEach((key, i) => {
      const zip = new JSZip();
      const arr: Array<string> = Object.values(m[key])[0];
      arr.forEach((src, i) => {
        zip.file(`image${i}.jpg`, src, { binary: false });
      });
      zip.generateAsync({ type: "blob" }).then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `images${i + 1}.zip`;
        link.click();
        URL.revokeObjectURL(url);
      });
    });
  } else if (type === DownloadType.SELECTED) {
    const m = map as Map<string, Set<string>>;
    let count = 0;
    m.forEach((val, key) => {
      const zip = new JSZip();
      val.forEach((src, i) => {
        zip.file(`image${i}.jpg`, src, { binary: false });
      });
      zip.generateAsync({ type: "blob" }).then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `images${++count}.zip`;
        link.click();
        URL.revokeObjectURL(url);
      });
    });
  } else if (type === DownloadType.SINGLE && src?.trim().length > 0) {
    console.log(src);
    const link = document.createElement("a");
    link.href = src;
    link.download = src;
    link.click();
  }
};
