import { NextPageContext } from "next";
import { FC, useEffect, useState } from "react";
import classes from "../../styles/results.module.css";
import { ImageMap, UrlImageMap } from "../../interfaces/ImageMap";
import axios from "axios";
import ErrorPage from "../../components/result/ErrorPage";
import InProgress from "../../components/result/InProgress";
import Results from "../../components/result/Results";
import { NextRouter, useRouter } from "next/router";
type Props = {
  urlImageMap: UrlImageMap<string, String>;
  status: { error: boolean; code: number };
  isSearching: boolean;
  q: string | string[];
  style: string | string[];
};

const ResultPage: FC<{ q: string | string[]; style: string | string[] }> = ({
  q,
  style,
}) => {
  // const router:NextRouter = useRouter();
  const [data, setData] = useState<Props>({
    isSearching: true,
    status: { error: false, code: 0 },
    urlImageMap: {},
    q: q,
    style: style,
  });
  useEffect(() => {
    if (data.isSearching) {
      axios
        .get("http://localhost:8080/api/v1/find", {
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
            q: data.q,
            style: data.style,
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
              q: data.q,
              style: data.style,
            });
          } else {
            console.log(reason);
            setData({
              isSearching: false,
              status: { error: true, code: 500 },
              urlImageMap: {},
              q: data.q,
              style: data.style,
            });
          }
        });
    }
  }, [data.isSearching]);

  if (data.isSearching) return <InProgress classes={classes} />;
  if (!data.isSearching && data.status.error)
    return <ErrorPage classes={classes} />;
  if (!data.isSearching && !data.status.error)
    return <Results results={data.urlImageMap} classes={classes} />;
};

export const getServerSideProps: (context: NextPageContext) => Promise<{
  props: { q: string | string[]; style: string | string[] };
}> = async (context) => {
  const { q, style } = context.query;
  return {
    props: {
      q: q,
      style: style,
    },
  };
};

export default ResultPage;
