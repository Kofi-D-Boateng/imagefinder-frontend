import { FC, useEffect, useState } from "react";
import classes from "../../styles/results.module.css";
import { ImageMap, UrlImageMap } from "../../interfaces/ImageMap";
import ErrorPage from "../../components/result/ErrorPage";
import InProgress from "../../components/result/InProgress";
import Results from "../../components/result/Results";
import { NextRouter, useRouter } from "next/router";
import AWS from "aws-sdk";

type Props = {
  urlImageMap: UrlImageMap<string, string>;
  status: { error: boolean; code: number };
  isSearching: boolean;
};

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const Lambda = new AWS.Lambda();

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
      Lambda.invoke({
        FunctionName: process.env.FUNCTION_NAMES[0],
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ url: q, mode: style }),
      })
        .promise()
        .then((data) => {
          const map: UrlImageMap<string, string> = {};
          for (const [outKey, inMap] of Object.entries(
            JSON.parse(data.Payload.toString())
          )) {
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
        .catch((err) => console.log(err));
    }
  }, [data.isSearching, q, style]);

  if (data.isSearching) return <InProgress classes={classes} />;
  if (!data.isSearching && data.status.error)
    return <ErrorPage classes={classes} />;
  if (!data.isSearching && !data.status.error)
    return <Results results={data.urlImageMap} classes={classes} />;
};

export default ResultPage;
