import { FC } from "react";
import { UrlImageMap } from "../../interfaces/ImageMap";
import Layout from "../Layout";

const Results: FC<{
  results: UrlImageMap<string, String>;
  classes: {
    readonly [key: string]: string;
  };
}> = ({ results }) => {
  console.log(results);
  return <Layout title="Results"></Layout>;
};

export default Results;
