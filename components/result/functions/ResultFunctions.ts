import axios from "axios";
import { Action } from "enums/Action";
import { DownloadType } from "enums/Download";
import { UrlImageMap } from "interfaces/ImageMap";
import JSZip from "jszip";
const zip = new JSZip();
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { Dispatch, SetStateAction, MouseEvent } from "react";

export const addRemoveHandler: (
  key: string,
  src: string,
  map: Map<string, Set<string>>,
  setAmount: Dispatch<
    SetStateAction<{
      [key: string]: number;
    }>
  >,
  action: Action
) => void = (key, src, map, setAmount, action) => {
  console.log(map);
  if (action === Action.ADD) {
    if (map.has(key)) {
      map.get(key).add(src);
      setAmount((prev) => {
        prev[key]++;
        return { ...prev };
      });
    } else {
      const set: Set<string> = new Set();
      set.add(src);
      map.set(key, set);
      setAmount((prev) => {
        prev[key] = set.size;
        return { ...prev };
      });
    }
  } else if (action === Action.REMOVE) {
    if (map.has(key)) {
      map.get(key).delete(src);
      setAmount((prev) => {
        if (prev[key] > 0) {
          prev[key]--;
        }
        return { ...prev };
      });
    }
  }
  console.log(map);
};

export const downloadHandler: (
  type: DownloadType,
  imageMap?: UrlImageMap<string, string> | Map<string, Set<string>>,
  src?: string,
  key?: string
) => void = (type, map, src, key) => {
  if (type === DownloadType.BULK) {
    const srcArr: Array<string> = new Array();
    const m: UrlImageMap<string, string> = map as UrlImageMap<string, string>;
    const innerMap = m[key];
    const keys = Object.keys(innerMap);
    keys.forEach((k) => innerMap[k].forEach((src) => srcArr.push(src)));
    if (srcArr.length < 50) {
      downloadZip(srcArr);
    } else {
      chunkedDownloadZip(srcArr, 20);
    }
  } else if (type === DownloadType.SELECTED) {
    const m = map as Map<string, Set<string>>;
    const urlSet = m.get(key);
    if (urlSet.size < 50) {
      downloadZip(urlSet);
    } else {
      chunkedDownloadZip(urlSet, 20);
    }
  } else if (type === DownloadType.SINGLE && src?.trim().length > 0) {
    axios
      .get(`/${publicRuntimeConfig.apiVersion}/download-image`, {
        headers: { Accept: "application/octet-stream" },
        responseType: "arraybuffer",
        params: { src: src },
      })
      .then((response) => {
        const url = URL.createObjectURL(
          new Blob([response.data], {
            type: "image/*",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.jpg";
        link.click();
      })
      .catch((reason) => console.log(reason));
  }
};

export const toggleHandler: (
  event: MouseEvent<HTMLDivElement>,
  setMultiSelect: (
    value: SetStateAction<{
      [key: string]: boolean;
    }>
  ) => void,
  setAmount: (
    value: SetStateAction<{
      [key: string]: number;
    }>
  ) => void
) => void = (e, setMultiSelect, setAmount) => {
  const { name } = e.currentTarget.dataset;
  if (!name) return;
  setMultiSelect((prev) => {
    if (prev[name]) {
      delete prev[name];
    } else {
      prev[name] = true;
    }
    return { ...prev };
  });
  setAmount((prev) => {
    if (prev[name] > 0) {
      delete prev[name];
    } else {
      prev[name] = 0;
    }
    return { ...prev };
  });
};

export const redirectHandler: (
  event: MouseEvent<HTMLButtonElement>,
  src: string
) => void = (e, src) => {
  const aTag = document.createElement("a");
  aTag.href = src;
  aTag.click();
};

/**
 * @param srcs Set | Array
 * @param n number (chunk size)
 *
 * @returns void
 *
 * @description This function is used to break up src arrays that are too big by a given chunk size.
 *
 */
const chunkedDownloadZip: (
  srcs: Set<string> | Array<string>,
  n: number
) => void = async (srcs, n) => {
  const batchSet: Array<Array<string>> = new Array();

  let ind = 0;
  let arr = new Array<string>();
  if (srcs instanceof Set) {
    srcs.forEach((src) => {
      if (ind <= n) {
        arr.push(src);
        ind++;
      } else {
        batchSet.push(arr);
        arr = new Array<string>();
        ind = 0;
      }
    });
  } else if (srcs instanceof Array) {
    srcs.forEach((src) => {
      if (ind < n) {
        arr.push(src);
        ind++;
      } else {
        batchSet.push(arr);
        arr = new Array<string>();
        ind = 0;
      }
    });
  }

  batchSet.map((val, i) =>
    axios
      .get(`/${publicRuntimeConfig.apiVersion}/download-zip`, {
        headers: { Accept: "application/octet-stream" },
        params: { srcs: JSON.stringify(val.join(",")) },
        responseType: "arraybuffer",
      })
      .then((response) => zip.file(`batch${i}.zip`, response.data))
      .catch((r) => console.log(r["message"] ? r["message"] : r))
  );

  // Generate the zip file and send it to the user
  const content = await zip.generateAsync({ type: "arraybuffer" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([content], { type: "application/octet-stream" })
  );
  link.download = "images.zip";
  link.click();
};

const downloadZip: (srcs: Set<string> | Array<string>) => void = (srcs) => {
  axios
    .get(`/${publicRuntimeConfig.apiVersion}/download-zip`, {
      headers: { Accept: "application/octet-stream" },
      params: {
        srcs:
          srcs instanceof Set
            ? JSON.stringify(Array.from(srcs).join(","))
            : JSON.stringify(srcs.join(",")),
      },
      responseType: "arraybuffer",
    })
    .then((response) => {
      const url = URL.createObjectURL(
        new Blob([response.data], {
          type: "application/zip",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "images.zip";
      link.click();
    })
    .catch((reason) => console.log(reason));
};
