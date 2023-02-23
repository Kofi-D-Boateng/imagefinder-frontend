import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { FC, useEffect, useState } from "react";
import classes from "../../styles/results.module.css";
import { ImageMap, UrlImageMap } from "../../interfaces/ImageMap";
import axios from "axios";
import ErrorPage from "../../components/result/ErrorPage";
import InProgress from "../../components/result/InProgress";
import Results from "../../components/result/Results";
import { NextRouter, useRouter } from "next/router";

type Props = {
  urlImageMap: UrlImageMap<string, string>;
  status: { error: boolean; code: number };
  isSearching: boolean;
};

const ResultPage: FC = () => {
  const router: NextRouter = useRouter();
  const { q, style } = router.query;
  const [data, setData] = useState<Props>({
    isSearching: true,
    status: { error: false, code: 0 },
    urlImageMap: {},
  });
  useEffect(() => {
    if (data.isSearching) {
      axios
        .get(`http://localhost:9000/${publicRuntimeConfig.apiVersion}/find`, {
          params: { url: q, mode: style },
        })
        .then((response) => {
          const map: UrlImageMap<string, string> = {};
          for (const [outKey, inMap] of Object.entries(response.data)) {
            const innerMap: ImageMap<string, string> = {};
            for (const [inKey, value] of Object.entries(inMap)) {
              innerMap[inKey] = value;
            }
            map[outKey] = innerMap;
          }
          setData({
            isSearching: false,
            status: { error: false, code: 200 },
            urlImageMap: map,
          });
        })
        .catch((reason) => {
          if (reason["response"]) {
            setData({
              isSearching: false,
              status: {
                error: true,
                code: Number(reason["response"]["status"]),
              },
              urlImageMap: {},
            });
          } else {
            console.log(reason);
            setData({
              isSearching: false,
              status: { error: true, code: 500 },
              urlImageMap: {},
            });
          }
        });
    }
  }, [data.isSearching, q, style]);

  if (data.isSearching) return <InProgress classes={classes} />;
  if (!data.isSearching && data.status.error)
    return <ErrorPage classes={classes} />;
  if (!data.isSearching && !data.status.error)
    return <Results results={data.urlImageMap} classes={classes} />;
};

export default ResultPage;
