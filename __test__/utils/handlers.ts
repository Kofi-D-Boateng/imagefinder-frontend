import { ImageMap, UrlImageMap } from "interfaces/ImageMap";
import { RestHandler, rest } from "msw";
import { sampleImgs } from "./resources";

export const handlers: RestHandler[] = [
  rest.get("http://localhost:8080/api/v1/find", async (req, res, ctx) => {
    const params = req.url.searchParams;
    const url = params.get("url");
    const mode = params.get("mode");
    console.log(url);
    console.log(mode);
    if (!url || !mode) {
      return res(ctx.status(400), ctx.json({}));
    }
    const returnMap: UrlImageMap<string, string> = {};
    url
      .toString()
      .split(",")
      .forEach((s, i) => {
        const innerMap: ImageMap<string, string> = {};
        innerMap["img"] =
          sampleImgs[i < sampleImgs.length ? i : sampleImgs.length];
        returnMap[s] = innerMap;
      });
    return res(ctx.status(200), ctx.json(returnMap));
  }),
];
