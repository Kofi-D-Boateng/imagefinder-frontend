import React, { ReactNode, useEffect } from "react";
import Head from "next/head";
import classes from "../../styles/layout.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "config/createEmotionCache";

type Props = {
  children?: ReactNode;
  title?: string;
};

const clientSideCache = createEmotionCache();

const Layout = ({ children, title = "This is the default title" }: Props) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={clientSideCache}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Find images from multiple websites at a press of a button."
        />
      </Head>
      <Navbar classes={classes} title={title} />
      <div>{children}</div>
      <Footer classes={classes} />
    </CacheProvider>
  );
};

export default Layout;
