import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { UrlImageMap } from "../../interfaces/ImageMap";
type Props = {
  urlImageMap: UrlImageMap;
  status: { error: boolean; code: number };
  isSearching: boolean;
};

const ResultPage: FC<Props> = ({ status, urlImageMap, isSearching }) => {
  if (isSearching) {
    return <></>;
  } else if (
    (!isSearching && !urlImageMap && !status.error) ||
    (!isSearching && Object.keys(urlImageMap).length <= 0 && !status.error)
  ) {
    return <></>;
  } else if (!isSearching && status.error) {
    return <></>;
  } else {
    return <></>;
  }
};

export const getServerSideProps: (
  context: NextPageContext
) => Promise<{ props: Props }> = async (context) => {
  const { q, style } = context.query;
  console.log(q);
  console.log(style);
  const url = `http://localhost:8080/find?url=${q}&mode=${style}`;
  const xhr: XMLHttpRequest = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.send(null);
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status != 200) {
      return {
        props: {
          status: { error: true, code: xhr.status },
          isSearching: false,
          urlImageMap: {},
        },
      };
    } else {
      return {
        props: {
          status: { error: false, code: xhr.status },
          isSearching: false,
          urlImageMap: xhr.responseText ? JSON.parse(xhr.responseText) : null,
        },
      };
    }
  }

  return {
    props: {
      status: { error: false, code: 0 },
      isSearching: true,
      urlImageMap: {},
    },
  };
};

export default ResultPage;
