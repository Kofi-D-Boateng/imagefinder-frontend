import { Action } from "enums/Action";
import { DownloadType } from "enums/Download";
import { UrlImageMap } from "interfaces/ImageMap";
import JSZip from "jszip";
import { Dispatch, SetStateAction, MouseEvent } from "react";
import AWS from "aws-sdk";
import { RequestQueue } from "classes/requestQueue";

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
};

export const downloadHandler: (
  type: DownloadType,
  imageMap?: UrlImageMap<string, string> | Map<string, Set<string>>,
  src?: string,
  key?: string
) => void = (type, map, src, key) => {
  AWS.config.update({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const Lambda = new AWS.Lambda();

  if (type === DownloadType.BULK) {
    const srcArr: Array<string> = new Array();
    const m: UrlImageMap<string, string> = map as UrlImageMap<string, string>;
    const innerMap = m[key];
    const keys = Object.keys(innerMap);
    keys.forEach((k) => innerMap[k].forEach((src) => srcArr.push(src)));
    if (srcArr.length < 50) {
      downloadZip(srcArr, Lambda);
    } else {
      chunkedDownloadZip(srcArr, 20, Lambda);
    }
  } else if (type === DownloadType.SELECTED) {
    const m = map as Map<string, Set<string>>;
    const urlSet = m.get(key);
    if (urlSet.size < 50) {
      downloadZip(urlSet, Lambda);
    } else {
      chunkedDownloadZip(urlSet, 20, Lambda);
    }
  } else if (type === DownloadType.SINGLE && src?.trim().length > 0) {
    Lambda.invoke({
      FunctionName: process.env.FUNCTION_NAMES[1],
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(src),
    })
      .promise()
      .then((response) => {
        const link = document.createElement("a");
        const encodedString = response.Payload.toString();
        link.href = `data:image/jpg;base64,${encodedString.substring(
          1,
          encodedString.length - 1
        )}`;
        link.download = "image.jpg";
        link.click();
      })
      .catch();
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

export const redirectHandler: (src: string) => void = (src) => {
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
  n: number,
  lambda: AWS.Lambda
) => void = async (srcs, n, lambda) => {
  const RQ: RequestQueue<string[]> = new RequestQueue();
  const zip = new JSZip();

  let ind = 0;
  let arr = new Array<string>();
  if (srcs instanceof Set) {
    srcs.forEach((src) => {
      if (ind <= n) {
        arr.push(src);
        ind++;
      } else {
        RQ.add(arr);
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
        RQ.add(arr);
        arr = new Array<string>();
        ind = 0;
      }
    });
  }
  let batchNum = 1;
  let delay = 1000;
  while (!RQ.isEmpty()) {
    setTimeout(() => {}, delay);
    const set = RQ.poll();
    await new Promise((resolve) => setTimeout(resolve, delay));
    lambda
      .invoke({
        FunctionName: process.env.FUNCTION_NAMES[2],
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(set.join(",")),
      })
      .promise()
      .then((data) => {
        zip.file(
          `batch${batchNum++}.zip`,
          data.Payload.toString().substring(
            1,
            data.Payload.toString().length - 1
          ) as string,
          { base64: true, binary: false, compression: "DEFLATE" }
        );
      })
      .catch((err) => {
        console.log(err);
        delay = delay + 50;
        RQ.add(set);
      });
  }

  // Generate the zip file and send it to the user
  const zipContent = await zip.generateAsync({ type: "base64" });
  const link = document.createElement("a");
  link.href = `data:application/zip;base64,${zipContent}`;
  link.download = "images.zip";
  link.click();
};

const downloadZip: (
  srcs: Set<string> | Array<string>,
  lambda: AWS.Lambda
) => void = (srcs, lambda) => {
  lambda
    .invoke({
      FunctionName: process.env.FUNCTION_NAMES[2],
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(
        srcs instanceof Set ? Array.from(srcs).join(",") : srcs.join(",")
      ),
    })
    .promise()
    .then((response) => {
      const link = document.createElement("a");
      const encodedString = response.Payload.toString();
      link.href = `data:application/zip;base64,${encodedString.substring(
        1,
        encodedString.length - 1
      )}`;
      link.download = "images.zip";
      link.click();
    });
};
