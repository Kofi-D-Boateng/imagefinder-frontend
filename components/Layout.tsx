import React, { ReactNode } from "react";
import Head from "next/head";
import classes from "../styles/layout.module.css";
import Navbar from "./ui/Navbar";
import Footer from "./ui/Footer";

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
    </Head>
    <Navbar classes={classes} />
    {children}
    <Footer classes={classes} />
  </div>
);

export default Layout;
