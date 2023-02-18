import React, { ReactNode } from "react";
import Head from "next/head";
import classes from "../../styles/layout.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div>
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
    {children}
    <Footer classes={classes} />
  </div>
);

export default Layout;
